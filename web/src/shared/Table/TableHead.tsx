import { PropsWithChildren } from "react";
interface TableHeadInterface {}

export const TableHead = ({
  children,
}: PropsWithChildren<TableHeadInterface>) => {
  return <thead>{children}</thead>;
};
