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
