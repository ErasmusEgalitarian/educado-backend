// Shared filter operator types between UI and query builder

export type FilterOp =
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

export interface StructuredFilter {
  op: FilterOp;
  value?: unknown;
}

// Mapping of filter operators to Strapi query parameter format
export const FILTER_OP_MAP: Record<FilterOp, string> = {
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

// Filter operators that expect array values
export const ARRAY_FILTER_OPS = new Set<FilterOp>(["in", "notIn", "between"]);

// Type guard to check if a value is a StructuredFilter
export const isStructuredFilter = (v: unknown): v is StructuredFilter => {
  if (typeof v !== "object" || v === null) return false;
  const rec = v as Record<string, unknown>;
  return typeof rec.op === "string";
};
