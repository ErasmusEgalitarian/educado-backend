import { PropsWithChildren } from "react";

interface TableContainerInterface {}

export const TableContainer = ({
  children,
}: PropsWithChildren<TableContainerInterface>) => {
  return (
    <div className="container mx-auto flex flex-col overflow-hidden gap-6">
      {children}
    </div>
  );
};
