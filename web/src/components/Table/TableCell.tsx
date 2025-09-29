/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { PropsWithChildren, ReactNode, useContext } from "react";
import { HeaderContext } from "./contexts";

export interface TableCellInterface {
  headerConfig?: { columnWidth: string };
}

export const TableCell = ({
  headerConfig,
  children,
}: PropsWithChildren<TableCellInterface>) => {
  const props = { headerConfig };

  return <TableCellItem {...props}>{children}</TableCellItem>;
};

const TableCellItem = ({
  headerConfig = { columnWidth: "basis-1/6" },
  children,
}: {
  headerConfig?: { columnWidth: string };
  children: ReactNode;
}) => {
  const { columnWidth } = headerConfig;

  const isHeaderCell = useContext(HeaderContext);

  return isHeaderCell ? (
    <th scope="col" className={`text-sm bg-transparent ${columnWidth}`}>
      {children}
    </th>
  ) : (
    <td>{children}</td>
  );
};
