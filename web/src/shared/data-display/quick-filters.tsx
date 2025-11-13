import { Table } from "@tanstack/react-table";

import { FilterDropdown } from "./filter-dropdown";

// Re-export for convenience
export type { QuickFilter } from "./types/table";
import type { QuickFilter } from "./types/table";

// Runtime filter with columnId (derived from column metadata + column.id)
type RuntimeQuickFilter = QuickFilter & { columnId: string; label: string };

const isEmpty = (v: unknown) => v === undefined || v === null || v === "";

function setColumnFilter<TData>(
  table: Table<TData>,
  columnId: string,
  value: unknown
) {
  table.setColumnFilters((prev) => {
    const others = prev.filter((f) => f.id !== columnId);
    return isEmpty(value) ? others : [...others, { id: columnId, value }];
  });
}

const QuickFilterButton = <TData,>({
  table,
  quickFilter,
  columnId,
}: Readonly<{
  table: Table<TData>;
  quickFilter: QuickFilter;
  columnId: string;
}>) => {
  const current = table.getColumn(columnId)?.getFilterValue();
  const isFiltered = !isEmpty(current);

  return (
    <FilterDropdown
      quickFilter={quickFilter}
      current={current}
      isFiltered={isFiltered}
      onSetFilter={(value) => setColumnFilter(table, columnId, value)}
      triggerVariant="outline"
      triggerSize="sm"
      contentClassName="min-w-[200px]"
    />
  );
};

// Helper to check if filter should be displayed
function shouldDisplayFilter(
  qf: QuickFilter,
  viewMode: "table" | "grid"
): boolean {
  const displayWhere = qf.displayType?.where ?? "toolbar";
  const displayWhen = qf.displayType?.when ?? "both";

  // Skip if filter is only for column headers
  if (displayWhere === "column") return false;

  // Skip if filter doesn't match current view mode
  if (displayWhen === "table" && viewMode !== "table") return false;
  if (displayWhen === "grid" && viewMode !== "grid") return false;

  return true;
}

export const QuickFilters = <TData,>({
  table,
  viewMode,
}: Readonly<{
  table: Table<TData>;
  viewMode: "table" | "grid";
}>) => {
  // Derive quick filters from column metadata
  const quickFilters: RuntimeQuickFilter[] = [];

  for (const col of table.getAllColumns()) {
    const meta = col.columnDef.meta;
    const qf = meta?.quickFilter;

    if (!qf) continue;
    if (!shouldDisplayFilter(qf, viewMode)) continue;

    const label =
      qf.label ??
      (typeof col.columnDef.header === "string"
        ? col.columnDef.header
        : col.id);

    quickFilters.push({
      ...qf,
      label,
      columnId: col.id,
    });
  }

  if (quickFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {quickFilters.map((qf) => (
        <QuickFilterButton
          key={qf.columnId}
          table={table}
          quickFilter={qf}
          columnId={qf.columnId}
        />
      ))}
    </div>
  );
};

export default QuickFilters;
