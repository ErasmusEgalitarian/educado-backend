/* eslint-disable @typescript-eslint/no-unused-vars */

// This file is used to extend the types of the react-table library
import "@tanstack/react-table";
export interface FilterDisplay {
  where: "toolbar" | "column" | "both";
  when?: "table" | "grid" | "both"; // defaults to "both"
}

// Base properties shared by all quick filters
interface QuickFilterBase {
  displayType?: FilterDisplay;
  label?: string;
}

// Quick filter types (used both in ColumnMeta and runtime components)
type QuickFilterText = QuickFilterBase & {
  type: "text";
  placeholder?: string;
};

type QuickFilterSelect = QuickFilterBase & {
  type: "select";
  multi?: boolean;
  options: { label: string; value: unknown; mdiIcon?: string }[];
};

export type QuickFilter = QuickFilterText | QuickFilterSelect;

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends object, TValue> {
    sortable?: boolean;
    visibleByDefault?: boolean;
    quickFilter?: QuickFilter;
  }
}
