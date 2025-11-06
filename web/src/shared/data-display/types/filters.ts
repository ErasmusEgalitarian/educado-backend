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
