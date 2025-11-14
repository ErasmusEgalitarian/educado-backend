import {
  flexRender,
  type Row,
  type Table as ReactTableType,
} from "@tanstack/react-table";
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";

import { useItemSelector } from "@/shared/components/item-selector";
import { TableRow, TableCell } from "@/shared/components/shadcn/table";
import { cn } from "@/shared/lib/utils";

import { DataDisplayItem } from "./data-display";

interface DataTableRowsProps<TData extends DataDisplayItem> {
  table: ReactTableType<TData>;
  isLoading: boolean;
  selectable?: boolean;
}

const DataTableRows = <TData extends DataDisplayItem>({
  table,
  isLoading,
  selectable = false,
}: Readonly<DataTableRowsProps<TData>>) => {
  const rows = table.getRowModel().rows;
  const columnsLength = table.getAllLeafColumns().length;

  if (isLoading) {
    return (
      <SkeletonRows
        columnsLength={columnsLength}
        rowsCount={10}
        selectable={selectable}
      />
    );
  }

  return <TableRowsBase rows={rows} selectable={selectable} />;
};

// ————————————————
// Subcomponents
// ————————————————

const SkeletonRows = ({
  columnsLength,
  rowsCount,
  selectable = false,
}: {
  columnsLength: number;
  rowsCount: number;
  selectable?: boolean;
}) => (
  <>
    {Array.from({ length: rowsCount }, (_, index) => (
      <TableRow key={`skeleton-row-${String(index)}`} className="group">
        {selectable && (
          <TableCell className="w-12">
            <div className="w-5 h-5 rounded border-2 bg-muted animate-pulse" />
          </TableCell>
        )}
        {Array.from({ length: columnsLength }, (_, cellIndex) => (
          <TableCell key={`skeleton-cell-${String(cellIndex)}`}>
            <div className="w-[100px] h-5 rounded-full bg-muted animate-pulse" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

const TableRowsBase = <TData extends DataDisplayItem>({
  rows,
  selectable = false,
}: {
  rows: Row<TData>[];
  selectable?: boolean;
}) => {
  if (!selectable) {
    // Non-selectable rows (original behavior)
    return (
      <>
        {rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  }

  // Selectable rows component
  return <SelectableTableRows rows={rows} />;
};

// Separate component for selectable rows to properly use hooks
const SelectableTableRows = <TData extends DataDisplayItem>({
  rows,
}: {
  rows: Row<TData>[];
}) => {
  const { isSelected, canSelect, toggleSelection } = useItemSelector();

  return (
    <>
      {rows.map((row) => {
        const documentId = row.original.documentId;

        // Skip selection for items without documentId
        if (documentId === undefined || documentId === "") {
          return (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              <TableCell className="w-12 px-4">
                <div className="h-5 w-5" />
              </TableCell>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          );
        }

        const selected = isSelected(documentId);
        const selectable = canSelect(documentId);

        const handleRowClick = () => {
          if (selectable || selected) {
            toggleSelection(documentId);
          }
        };

        return (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            onClick={handleRowClick}
            className={cn(
              "cursor-pointer transition-colors",
              selected && "bg-primary-surface-default/10",
              !selectable && !selected && "opacity-40 cursor-not-allowed"
            )}
          >
            <TableCell className="w-12 px-4">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded border-2 transition-all",
                  selected
                    ? "border-primary-surface-default bg-primary-surface-default text-white"
                    : "border-[#c1cfd7] bg-white"
                )}
              >
                {selected && <Icon path={mdiCheck} className="h-3 w-3" />}
              </div>
            </TableCell>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </>
  );
};

export default DataTableRows;
