/* eslint-disable @typescript-eslint/no-unused-vars */

// This file is used to extend the types of the react-table library
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends object, TValue> {
        sortable?: boolean;
        filterable?: boolean;
        visibleByDefault?: boolean;
    }
}
