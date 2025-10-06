export interface PaginationParameters {
    page: number;
    pageSize: number;
    sort?: string;
}

export interface PaginationStatus {
    totalPages: number;
    totalElements: number;
}

// Strapi pagination response structure
export interface PaginatedData<T> {
    data: T[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}
