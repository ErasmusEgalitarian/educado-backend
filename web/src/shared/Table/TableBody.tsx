import { PropsWithChildren } from "react";

interface TableBodyInterface {}

export const TableBody = ({
  children,
}: PropsWithChildren<TableBodyInterface>) => {
  return <tbody>{children}</tbody>;
};
