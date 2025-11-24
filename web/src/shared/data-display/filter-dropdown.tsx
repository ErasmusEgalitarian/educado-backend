import { mdiFilterOutline, mdiFilterCheck } from "@mdi/js";
import { Icon } from "@mdi/react";

import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/shadcn/dropdown-menu";

import type { QuickFilter } from "./types/table";

// Shared component for rendering filter option with optional icon
const FilterOption = ({
  label,
  mdiIcon,
}: {
  label: string;
  mdiIcon?: string;
}) => (
  <div className="flex items-center gap-2">
    {mdiIcon != null && mdiIcon !== "" && (
      <Icon path={mdiIcon} size={0.75} className="h-4 w-4" />
    )}
    {label}
  </div>
);

export interface FilterDropdownProps {
  quickFilter: QuickFilter;
  current: unknown;
  isFiltered: boolean;
  onSetFilter: (value: unknown) => void;
  triggerVariant?: "outline" | "secondary" | "ghost";
  triggerSize?: "sm" | "icon";
  triggerClassName?: string;
  contentClassName?: string;
}

export const FilterDropdown = ({
  quickFilter,
  current,
  isFiltered,
  onSetFilter,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerClassName,
  contentClassName,
}: FilterDropdownProps) => {
  // Text filter
  if (quickFilter.type === "text") {
    const currentText = typeof current === "string" ? current : "";
    const isActive = currentText !== "";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isActive ? "secondary" : triggerVariant}
            size={triggerSize}
            className={triggerClassName}
          >
            <Icon
              path={isActive ? mdiFilterCheck : mdiFilterOutline}
              size={triggerSize === "icon" ? 0.7 : 1}
              className="h-4 w-4"
            />
            {triggerSize === "sm" && (
              <span className="ml-2">{quickFilter.label}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[220px] p-2">
          <Input
            placeholder={quickFilter.placeholder ?? "Type to filter..."}
            value={currentText}
            onChange={(e) => {
              const v = e.target.value;
              onSetFilter(v.trim() === "" ? undefined : v);
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
    onSetFilter(checked ? value : undefined);
  };

  const setMulti = (checked: boolean, value: unknown) => {
    const arr = Array.isArray(current) ? (current as unknown[]).slice() : [];
    const idx = arr.indexOf(value as never);
    if (checked && idx === -1) arr.push(value);
    if (!checked && idx !== -1) arr.splice(idx, 1);
    onSetFilter(arr.length > 0 ? arr : undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isFiltered ? "secondary" : triggerVariant}
          size={triggerSize}
          className={triggerClassName}
        >
          <Icon
            path={isFiltered ? mdiFilterCheck : mdiFilterOutline}
            size={triggerSize === "icon" ? 0.7 : 1}
            className="h-4 w-4"
          />
          {triggerSize === "sm" && (
            <span className="ml-2">{quickFilter.label}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={contentClassName ?? "min-w-[200px]"}
      >
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
              <FilterOption label={opt.label} mdiIcon={opt.mdiIcon} />
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
