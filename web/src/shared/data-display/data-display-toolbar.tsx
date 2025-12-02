/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  mdiMagnify,
  mdiSort,
  mdiSortAscending,
  mdiSortDescending,
  mdiViewColumn,
  mdiChevronDown,
  mdiGrid,
  mdiFormatListBulleted,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { SelectionSummary } from "@/shared/components/item-selector";
import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/shadcn/dropdown-menu";

import { ViewMode } from "./data-display";
import QuickFilters from "./quick-filters";

export interface DataDisplayToolbarProps<TData> {
  table: Table<TData>;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  hasTable: boolean;
  hasGrid: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
  visibility?: ToolbarVisibilityProps;
  selectable?: boolean;
}

export interface ToolbarVisibilityProps {
  showToolbar?: boolean;
  showSearch?: boolean;
  showSortGrid?: boolean;
  showColumnTogglerTable?: boolean;
}

/* ---------------------------- View mode toggler --------------------------- */
const ViewToggle = ({
  viewMode,
  onViewModeChange,
  hasTable,
  hasGrid,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  hasTable: boolean;
  hasGrid: boolean;
}) => {
  if (!(hasTable && hasGrid)) return null;
  return (
    <div className="flex items-center bg-muted rounded-lg gap-0">
      <Button
        variant={viewMode === "grid" ? "primary" : "ghost"}
        size="sm"
        onClick={() => {
          onViewModeChange("grid");
        }}
        className="w-8 px-0"
      >
        <Icon path={mdiGrid} className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "table" ? "primary" : "ghost"}
        size="sm"
        onClick={() => {
          onViewModeChange("table");
        }}
        className="w-8 px-0"
      >
        <Icon path={mdiFormatListBulleted} className="h-4 w-4" />
      </Button>
    </div>
  );
};

/* ------------------------------ Sort dropdown ----------------------------- */
const SortDropdown = <TData,>({ table }: { table: Table<TData> }) => {
  const { t } = useTranslation();

  // Get all sortable columns except those that are not user-facing
  const items = table
    .getAllColumns()
    .filter((column) => column.accessorFn !== undefined)
    .filter((column) => column.getCanSort())
    .filter((column) => column.id.toLowerCase() !== "documentid");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm">
          <Icon path={mdiSort} size={1} className="mr-2 h-4 w-4" />
          {t("common.sort")}
          <Icon path={mdiChevronDown} className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[250px]">
        <DropdownMenuLabel>{t("common.sortBy")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((column) => {
          const isSorted = column.getIsSorted();
          const header =
            typeof column.columnDef.header === "string"
              ? column.columnDef.header
              : column.id;
          return (
            <DropdownMenuItem
              key={column.id}
              onSelect={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                if (isSorted === false) column.toggleSorting(false);
                else if (isSorted === "asc") column.toggleSorting(true);
                else column.clearSorting();
              }}
              className="flex items-center justify-between"
            >
              <span>{header}</span>
              <div className="flex items-center gap-1">
                {isSorted === "asc" && (
                  <>
                    <Icon
                      path={mdiSortAscending}
                      size={0.7}
                      className="h-4 w-4"
                    />
                    <span className="text-xs text-muted-foreground">
                      {t("common.ascending")}
                    </span>
                  </>
                )}
                {isSorted === "desc" && (
                  <>
                    <Icon
                      path={mdiSortDescending}
                      size={0.7}
                      className="h-4 w-4"
                    />
                    <span className="text-xs text-muted-foreground">
                      {t("common.descending")}
                    </span>
                  </>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* --------------------------- Column toggler --------------------------- */
const ColumnToggler = <TData,>({ table }: { table: Table<TData> }) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="ml-auto hidden lg:flex"
        >
          <Icon path={mdiViewColumn} size={1} className="mr-2 h-4 w-4" />
          {t("common.columns")}
          <Icon path={mdiChevronDown} className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {table
          .getAllColumns()
          .filter(
            (column) => column.accessorFn !== undefined && column.getCanHide()
          )
          .map((column) => {
            const header =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id;
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => {
                  column.toggleVisibility(value);
                }}
              >
                {header}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ------------------------------ Global Search ----------------------------- */
interface SearchBoxProps {
  value: string;
  onChange?: (value: string) => void;
}

const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  const { t } = useTranslation();
  if (!onChange) return null;
  return (
    <div className="relative flex-initial min-w-0 w-56 max-w-full">
      <Icon
        path={mdiMagnify}
        size={1}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4"
      />
      <Input
        placeholder={t("actions.search") + "..."}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        inputSize="sm"
        className="pl-10 w-full"
      />
      {value !== "" && (
        <Button
          variant="blank"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          onClick={() => {
            onChange("");
          }}
          aria-label={t("actions.clear")}
          title={t("actions.clear")}
        >
          ×
        </Button>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Toolbar                                  */
/* -------------------------------------------------------------------------- */
const DataDisplayToolbar = <TData,>({
  table,
  viewMode,
  onViewModeChange,
  hasTable,
  hasGrid,
  searchValue = "",
  onSearchChange,
  className = "",
  visibility = {
    showToolbar: true,
    showSearch: true,
    showSortGrid: true,
    showColumnTogglerTable: true,
  },
  selectable = false,
}: Readonly<DataDisplayToolbarProps<TData>>) => {
  // Return null if toolbar is hidden
  if (visibility.showToolbar === false) return null;

  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      {/* View toggle - always first */}
      <ViewToggle
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        hasTable={hasTable}
        hasGrid={hasGrid}
      />

      {/* Filters - wraps to new line when space is tight */}
      <QuickFilters table={table} viewMode={viewMode} />

      {/* Right section - selection, sort/columns, search - stays together */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        {selectable && <SelectionSummary />}

        {visibility.showSortGrid === true && viewMode === "grid" && (
          <SortDropdown table={table} />
        )}
        {visibility.showColumnTogglerTable === true && viewMode === "table" && (
          <ColumnToggler table={table} />
        )}

        {visibility.showSearch === true && (
          <SearchBox value={searchValue} onChange={onSearchChange} />
        )}
      </div>
    </div>
  );
};

export default DataDisplayToolbar;
