import { PropsWithChildren } from "react";
interface TableInterface {}

export const Table = ({ children }: PropsWithChildren<TableInterface>) => {
  return <table className="table table-fixed w-full">{children}</table>;
};
