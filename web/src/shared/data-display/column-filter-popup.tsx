import { Column } from "@tanstack/react-table";

import { FilterDropdown } from "./filter-dropdown";
import { isEmpty } from "./quick-filters";

import type { QuickFilter } from "./types/table";

interface ColumnFilterPopupProps<TData> {
  column: Column<TData>;
  quickFilter: QuickFilter | undefined;
}

export const ColumnFilterPopup = <TData,>({
  column,
  quickFilter,
}: ColumnFilterPopupProps<TData>) => {
  const current = column.getFilterValue();
  const isFiltered = !isEmpty(current);

  const setFilter = (value: unknown) => {
    column.setFilterValue(isEmpty(value) ? undefined : value);
  };

  if (!quickFilter) return null;

  return (
    <FilterDropdown
      quickFilter={quickFilter}
      current={current}
      isFiltered={isFiltered}
      onSetFilter={setFilter}
      triggerVariant="ghost"
      triggerSize="icon"
      triggerClassName="h-8 w-8"
      contentClassName="min-w-[200px]"
    />
  );
};

export default ColumnFilterPopup;
