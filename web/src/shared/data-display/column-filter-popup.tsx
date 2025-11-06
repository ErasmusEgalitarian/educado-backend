import { mdiFilter, mdiFilterOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import { Column } from "@tanstack/react-table";

import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/shadcn/dropdown-menu";

import type { QuickFilter } from "./types/table";

const isEmpty = (v: unknown) => v === undefined || v === null || v === "";

interface ColumnFilterPopupProps<TData> {
  column: Column<TData>;
  quickFilter: QuickFilter;
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

  // Text filter
  if (quickFilter.type === "text") {
    const currentText = typeof current === "string" ? current : "";
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isFiltered ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
          >
            <Icon
              path={isFiltered ? mdiFilter : mdiFilterOutline}
              size={0.7}
              className="h-4 w-4"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[220px] p-2">
          <Input
            placeholder={quickFilter.placeholder ?? "Type to filter..."}
            value={currentText}
            onChange={(e) => {
              const v = e.target.value;
              setFilter(v.trim() === "" ? undefined : v);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Select filter
  const isMulti = quickFilter.multi === true;

  const setSingle = (checked: boolean, value: unknown) => {
    setFilter(checked ? value : undefined);
  };

  const setMulti = (checked: boolean, value: unknown) => {
    const arr = Array.isArray(current) ? (current as unknown[]).slice() : [];
    const idx = arr.indexOf(value as never);
    if (checked && idx === -1) arr.push(value);
    if (!checked && idx !== -1) arr.splice(idx, 1);
    setFilter(arr.length > 0 ? arr : undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isFiltered ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
        >
          <Icon
            path={isFiltered ? mdiFilter : mdiFilterOutline}
            size={0.7}
            className="h-4 w-4"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px]">
        {quickFilter.options.map((opt) => {
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

export default ColumnFilterPopup;
