import { ServerRequestParams } from "../hooks/used-paginated-data";

export type StaticFilters = Record<string, unknown>;
export type Status = "draft" | "published";

// Function to convert request parameters to URLSearchParams for Strapi
export const buildApiQueryParams = (
  params: Partial<ServerRequestParams>,
  fields?: string[],
  populate?: string | string[],
  staticFilters?: StaticFilters,
  status?: Status,
): URLSearchParams => {
  const searchParams = new URLSearchParams();

  // ————————————————
  // Helper utilities
  // ————————————————

  type Op =
    | "eq"
    | "eqi"
    | "ne"
    | "nei"
    | "lt"
    | "lte"
    | "gt"
    | "gte"
    | "in"
    | "notIn"
    | "contains"
    | "notContains"
    | "containsi"
    | "notContainsi"
    | "null"
    | "notNull"
    | "between"
    | "startsWith"
    | "startsWithi"
    | "endsWith"
    | "endsWithi";

  const opMap: Record<Op, string> = {
    eq: "$eq",
    eqi: "$eqi",
    ne: "$ne",
    nei: "$nei",
    lt: "$lt",
    lte: "$lte",
    gt: "$gt",
    gte: "$gte",
    in: "$in",
    notIn: "$notIn",
    contains: "$contains",
    notContains: "$notContains",
    containsi: "$containsi",
    notContainsi: "$notContainsi",
    null: "$null",
    notNull: "$notNull",
    between: "$between",
    startsWith: "$startsWith",
    startsWithi: "$startsWithi",
    endsWith: "$endsWith",
    endsWithi: "$endsWithi",
  };

  interface StructuredFilter {
    op: Op;
    value?: unknown;
  }

  const isStructured = (v: unknown): v is StructuredFilter => {
    if (typeof v !== "object" || v === null) return false;
    const rec = v as Record<string, unknown>;
    return typeof rec.op === "string";
  };

  const toStringValue = (v: unknown): string | null => {
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    return null;
  };

  const buildFilterKey = (field: string, op: string): string => {
    // Support deep fields e.g. "author.name" => filters[author][name][$eq]
    const parts = field.split(".").filter(Boolean);
    const nested = parts.map((p) => `[${p}]`).join("");
    return `filters${nested}[${op}]`;
  };

  const appendArrayValues = (
    sp: URLSearchParams,
    field: string,
    op: string,
    arr: unknown[],
  ) => {
    const key = buildFilterKey(field, op);
    for (const item of arr) {
      const sv = toStringValue(item);
      if (sv !== null) sp.append(key, sv);
    }
  };

  const appendSingleValue = (
    sp: URLSearchParams,
    field: string,
    op: string,
    val: unknown,
  ) => {
    const sv = toStringValue(val);
    if (sv !== null) sp.append(buildFilterKey(field, op), sv);
  };

  const structuredOpSet = new Set<Op>(["in", "notIn", "between"]);

  const handleStructured = (
    sp: URLSearchParams,
    field: string,
    sf: StructuredFilter,
  ) => {
    const mapped = opMap[sf.op];
    if (sf.op === "null" || sf.op === "notNull") {
      sp.append(buildFilterKey(field, mapped), "true");
      return;
    }
    if (structuredOpSet.has(sf.op)) {
      if (Array.isArray(sf.value)) appendArrayValues(sp, field, mapped, sf.value);
      return;
    }
    if (sf.value !== undefined) appendSingleValue(sp, field, mapped, sf.value);
  };

  const handlePrimitiveArray = (
    sp: URLSearchParams,
    field: string,
    arr: unknown[],
  ) => {
    appendArrayValues(sp, field, "$in", arr);
  };

  const handlePrimitive = (
    sp: URLSearchParams,
    field: string,
    raw: string | number | boolean,
  ) => {
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed !== "") appendSingleValue(sp, field, "$containsi", trimmed);
      return;
    }
    appendSingleValue(sp, field, "$eq", raw);
  };

  const handleFilter = (sp: URLSearchParams, field: string, raw: unknown) => {
    if (raw === undefined || raw === null) return;
    if (isStructured(raw)) {
      handleStructured(sp, field, raw);
      return;
    }
    if (Array.isArray(raw)) {
      handlePrimitiveArray(sp, field, raw);
      return;
    }
    const isPrimitive = (
      v: unknown,
    ): v is string | number | boolean =>
      typeof v === "string" || typeof v === "number" || typeof v === "boolean";
    if (isPrimitive(raw)) handlePrimitive(sp, field, raw);
  };

  const appendFiltersFromColumnFilters = (
    sp: URLSearchParams,
    columnFilters: { id: string; value?: unknown }[] | undefined,
  ) => {
    if (!Array.isArray(columnFilters) || columnFilters.length === 0) return;
    for (const f of columnFilters) {
      handleFilter(sp, f.id, f.value);
    }
  };

  function applyPagination() {
    const pageIndex = params.pageIndex ?? 0;
    searchParams.set("pagination[page]", String(pageIndex + 1));
    searchParams.set("pagination[pageSize]", String(params.pageSize ?? 10));
  }

  function applySorting() {
    const sorting = params.sorting;
    if (!Array.isArray(sorting) || sorting.length === 0) return;
    const first = sorting[0];
    const sortOrder = first.desc ? "desc" : "asc";
    searchParams.set("sort", `${first.id}:${sortOrder}`);
  }

  function applyFields() {
    if (!Array.isArray(fields) || fields.length === 0) return;
    for (const field of fields) searchParams.append("fields", field);
  }

  function applyPopulate() {
    if (typeof populate === "string" && populate !== "") {
      searchParams.set("populate", populate);
      return;
    }
    if (!Array.isArray(populate) || populate.length === 0) return;
    for (const rel of populate) searchParams.append("populate", rel);
  }

  // Construct manual server-side global filtering by using $or on all specified fields
  function applyGlobalFilter() {
    const gf = params.globalFilter;
    if (typeof gf !== "string") return;
    const trimmed = gf.trim();
    if (trimmed === "") return;
    if (!Array.isArray(fields)) return;
    if (fields.length === 0) return;
    let idx = 0;
    for (const field of fields) {
      searchParams.append(
        `filters[$or][${String(idx)}][${field}][$containsi]`,
        trimmed,
      );
      idx += 1;
    }
  }

  // Translate TanStack columnFilters into Strapi v4 filter syntax
  function applyColumnFilters() {
    appendFiltersFromColumnFilters(
      searchParams,
      params.columnFilters as { id: string; value?: unknown }[]
    );
  }

  // Apply static filters that are always sent with the request
  function applyStaticFilters() {
    if (!staticFilters || Object.keys(staticFilters).length === 0) return;
    for (const [field, value] of Object.entries(staticFilters)) {
      handleFilter(searchParams, field, value);
    }
  }

  // Apply status parameter (draft or published)
  // NOTE: Strapi v5 Draft & Publish behavior is complex:
  // - status=published: Returns ONLY published versions ✓
  // - status=draft: Returns draft versions of ALL documents (even those with published versions)
  // - filters[publishedAt][$null]=true: DOESN'T WORK - publishedAt is not filterable via REST API
  //
  // LIMITATION: There's no way via REST API to get "only unpublished documents"
  // The best we can do is use status=draft (returns all draft versions)
  // For "true drafts only", would need client-side filtering or custom Strapi controller
  function applyStatus() {
    if (status) {
      searchParams.set("status", status);
    }
  }

  applyPagination();
  applySorting();
  applyFields();
  applyPopulate();
  applyGlobalFilter();
  applyColumnFilters();
  applyStaticFilters();
  applyStatus();

  return searchParams;
};
