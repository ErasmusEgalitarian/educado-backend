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
import { ButtonGroup } from "@/shared/components/shadcn/button-group";
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
  selectable?: boolean;
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
  selectable = false,
}: DataDisplayToolbarProps<TData>) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* View mode toggle - left side */}
      {hasTable && hasGrid && (
        <ButtonGroup>
          <Button
            variant={viewMode === "grid" ? "toggle" : "outline"}
            size="sm"
            onClick={() => {
              onViewModeChange("grid");
            }}
          >
            <Icon path={mdiGrid} className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "toggle" : "outline"}
            size="sm"
            onClick={() => {
              onViewModeChange("table");
            }}
          >
            <Icon path={mdiFormatListBulleted} className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      )}

      {/* Selection Summary */}
      {selectable && <SelectionSummary />}

      <div className="flex items-center gap-4 ml-auto">
        {/* Search - right side */}
        {onSearchChange && (
          <div className="">
            <Input
              placeholder={t("actions.search") + "..."}
              value={searchValue}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              endIcon={<Icon path={mdiMagnify} size={1} />}
            />
          </div>
        )}

        {/* Sort Dropdown - grid mode only */}
        {viewMode === "grid" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="md" className="ml-auto">
                <Icon path={mdiSort} size={1} className="mr-2 h-4 w-4" />
                {t("common.sort")}
                <Icon path={mdiChevronDown} className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[250px]">
              <DropdownMenuLabel>{t("common.sortBy")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.accessorFn !== undefined)
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
                variant="outline"
                size="md"
                className="ml-auto hidden lg:flex"
              >
                <Icon path={mdiViewColumn} size={1} className="mr-2 h-4 w-4" />
                {t("common.columns")}
                <Icon path={mdiChevronDown} className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    column.accessorFn !== undefined && column.getCanHide()
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
      </div>
    </div>
  );
};

export default DataDisplayToolbar;
