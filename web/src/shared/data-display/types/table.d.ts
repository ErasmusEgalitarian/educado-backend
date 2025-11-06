/* eslint-disable @typescript-eslint/no-unused-vars */

// This file is used to extend the types of the react-table library
import "@tanstack/react-table";
import { ViewMode } from "../data-display";

export type FilterDisplay = {
  where: "toolbar" | "column" | "both";
  when?: "table" | "grid" | "both"; // defaults to "both"
};

// Base properties shared by all quick filters
type QuickFilterBase = {
  displayType?: FilterDisplay;
  label?: string;
};

// Quick filter types (used both in ColumnMeta and runtime components)
type QuickFilterText = QuickFilterBase & {
  type: "text";
  placeholder?: string;
};

type QuickFilterSelect = QuickFilterBase & {
  type: "select";
  multi?: boolean;
  options: { label: string; value: unknown }[];
};

export type QuickFilter = QuickFilterText | QuickFilterSelect;

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends object, TValue> {
    sortable?: boolean;
    filterable?: boolean;
    visibleByDefault?: boolean;
    quickFilter?: QuickFilter;
  }
}
