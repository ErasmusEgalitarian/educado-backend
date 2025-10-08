import { type Table as ReactTableType } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/shadcn/table";

import DataTableHeaderCell from "./data-table-header-cell";
import DataTableRows from "./data-table-rows";

import type { DataDisplayItem } from "./data-display";

interface DataTableProps<TData extends DataDisplayItem> {
  table: ReactTableType<TData>;
  isLoading: boolean;
  className?: string;
}

const DataTable = <TData extends DataDisplayItem>({
  table,
  isLoading,
  className,
}: Readonly<DataTableProps<TData>>) => {
  return (
    <div className={`rounded-md border ${className ?? ""}`}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <DataTableHeaderCell header={header} table={table} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <DataTableRows table={table} isLoading={isLoading} />
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
