import { ColumnDef, VisibilityState } from "@tanstack/react-table";

export function getDefaultColumnVisibility<TData, TValue>(
  columns: ColumnDef<TData, TValue>[],
): VisibilityState {
  return columns.reduce<VisibilityState>((acc, col) => {
    // TanStack Table uses either `id` or `accessorKey` as the column identifier
    const columnId =
      col.id ??
      (typeof (col as { accessorKey?: unknown }).accessorKey === "string"
        ? (col as { accessorKey: string }).accessorKey
        : undefined);
    if (columnId == null) return acc;

    const visible = col.meta?.visibleByDefault ?? true;
    acc[columnId] = visible;
    return acc;
  }, {});
}
