import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/shadcn/dropdown-menu";

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

const TextQuickFilterComponent = <TData,>({
  table,
  label,
  columnId,
  placeholder,
}: Readonly<{
  table: Table<TData>;
  label: string;
  columnId: string;
  placeholder?: string;
}>) => {
  const current = table.getColumn(columnId)?.getFilterValue();
  const currentText = typeof current === "string" ? current : "";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={currentText ? "secondary" : "ghost"} size="sm">
          {label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[220px] p-2">
        <Input
          placeholder={placeholder ?? "Type to filter..."}
          value={currentText}
          onChange={(e) => {
            const v = e.target.value;
            setColumnFilter(table, columnId, v.trim() === "" ? undefined : v);
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SelectQuickFilterComponent = <TData,>({
  table,
  label,
  columnId,
  multi,
  options,
}: Readonly<{
  table: Table<TData>;
  label: string;
  columnId: string;
  multi?: boolean;
  options: { label: string; value: unknown }[];
}>) => {
  const col = table.getColumn(columnId);
  const current = col?.getFilterValue();
  const isMulti = multi === true;

  const setSingle = (checked: boolean, value: unknown) => {
    setColumnFilter(table, columnId, checked ? value : undefined);
  };

  const setMulti = (checked: boolean, value: unknown) => {
    const arr = Array.isArray(current) ? (current as unknown[]).slice() : [];
    const idx = arr.indexOf(value as never);
    if (checked && idx === -1) arr.push(value);
    if (!checked && idx !== -1) arr.splice(idx, 1);
    setColumnFilter(table, columnId, arr.length > 0 ? arr : undefined);
  };

  // Determine whether any value is currently set for this column's filter
  const isActive = Array.isArray(current)
    ? (current as unknown[]).length > 0
    : current !== undefined && current !== null && current !== "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={isActive ? "secondary" : "ghost"} size="sm">
          {label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px]">
        {options.map((opt) => {
          const currentArr = Array.isArray(current)
            ? (current as unknown[])
            : null;
          const isChecked = currentArr
            ? currentArr.includes(opt.value as never)
            : current === opt.value;
          return (
            <DropdownMenuCheckboxItem
              key={opt.label}
              checked={isChecked}
              onCheckedChange={(checked) => {
                if (isMulti) {
                  setMulti(checked, opt.value);
                } else {
                  setSingle(checked, opt.value);
                }
              }}
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
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

    if (!meta?.filterable || !qf) continue;
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
    <div className="flex items-center gap-2">
      {quickFilters.map((qf) =>
        qf.type === "text" ? (
          <TextQuickFilterComponent
            key={qf.columnId}
            table={table}
            label={qf.label}
            columnId={qf.columnId}
            placeholder={qf.placeholder}
          />
        ) : (
          <SelectQuickFilterComponent
            key={qf.columnId}
            table={table}
            label={qf.label}
            columnId={qf.columnId}
            multi={qf.multi}
            options={qf.options}
          />
        )
      )}
    </div>
  );
};

export default QuickFilters;
