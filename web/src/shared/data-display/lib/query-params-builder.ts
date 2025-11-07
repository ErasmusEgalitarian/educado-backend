import { ServerRequestParams } from "../hooks/used-paginated-data";

// Function to convert request parameters to URLSearchParams for Strapi
export const buildApiQueryParams = (
  params: Partial<ServerRequestParams>,
  fields?: string[],
  populate?: string | string[],
): URLSearchParams => {
  const searchParams = new URLSearchParams();

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
    
    // Map column IDs to actual Strapi field names for sorting
    // For relation fields, we'll use client-side sorting (handled by accessorFn)
    // For direct fields like publishedAt, we can sort server-side
    let sortField = first.id;
    
    // Handle special cases for relation-based columns
    // These will fall back to client-side sorting if server-side isn't supported
    if (first.id === "course_categories") {
      // Strapi doesn't easily support sorting by relation fields
      // This will be handled client-side via accessorFn
      // For server-side, we skip it (client mode handles it)
      return;
    }
    if (first.id === "creator") {
      // Same as above - handled client-side
      return;
    }
    
    searchParams.set("sort", `${sortField}:${sortOrder}`);
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
    fields.forEach((field, idx) => {
      searchParams.append(
        `filters[$or][${String(idx)}][${field}][$containsi]`,
        trimmed,
      );
    });
  }

  applyPagination();
  applySorting();
  applyFields();
  applyPopulate();
  applyGlobalFilter();

  return searchParams;
};
