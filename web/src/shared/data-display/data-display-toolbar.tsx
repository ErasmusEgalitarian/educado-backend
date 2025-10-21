import {
  mdiMagnify,
  mdiSort,
  mdiSortAscending,
  mdiSortDescending,
  mdiViewColumn,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { Table } from "@tanstack/react-table";
import { ChevronDown, Grid, List } from "lucide-react";
import { useTranslation } from "react-i18next";

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

export interface DataDisplayToolbarProps<TData> {
  table: Table<TData>;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  hasTable: boolean;
  hasGrid: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}

/** Toolbar for data display components, including view mode toggle, column toggler, and search input. */
const DataDisplayToolbar = <TData,>({
  table,
  viewMode,
  onViewModeChange,
  hasTable,
  hasGrid,
  searchValue = "",
  onSearchChange,
  className = "",
}: DataDisplayToolbarProps<TData>) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* View mode toggle - left side */}
      {hasTable && hasGrid && (
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "primary" : "ghost"}
            size="sm"
            onClick={() => {
              onViewModeChange("grid");
            }}
            className="h-8 w-8 p-0"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "primary" : "ghost"}
            size="sm"
            onClick={() => {
              onViewModeChange("table");
            }}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Sort Dropdown - grid mode only */}
      {viewMode === "grid" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="ml-auto">
              <Icon path={mdiSort} size={1} className="mr-2 h-4 w-4" />
              {t("common.sort")}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[250px]">
            <DropdownMenuLabel>{t("common.sortBy")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => typeof column.accessorFn !== "undefined")
              .filter((column) => column.getCanSort())
              .filter((column) => column.id.toLowerCase() !== "documentid")
              .map((column) => {
                const isSorted = column.getIsSorted();
                const header =
                  typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id;

                return (
                  <DropdownMenuItem
                    key={column.id}
                    onSelect={(e) => {
                      e.preventDefault(); // Prevent dropdown from closing
                    }}
                    onClick={() => {
                      // Toggle through: no sort -> asc -> desc -> no sort
                      if (isSorted === false) {
                        column.toggleSorting(false); // Set to ascending
                      } else if (isSorted === "asc") {
                        column.toggleSorting(true); // Set to descending
                      } else {
                        column.clearSorting(); // Clear sorting
                      }
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
      )}

      {/* Column Toggler - table mode only */}
      {viewMode === "table" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto hidden lg:flex"
            >
              <Icon path={mdiViewColumn} size={1} className="mr-2 h-4 w-4" />
              {t("common.columns")}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
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
                      column.toggleVisibility(value satisfies boolean);
                    }}
                  >
                    {header}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Search - right side */}
      {onSearchChange && (
        <div className="relative flex-1 max-w-md">
          <Icon
            path={mdiMagnify}
            size={1}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
          />
          <Input
            placeholder={t("actions.search") + "..."}
            value={searchValue}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            className="pl-10"
          />
        </div>
      )}
    </div>
  );
};

export default DataDisplayToolbar;
