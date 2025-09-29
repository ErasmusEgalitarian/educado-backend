/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useEffect, useState } from "react";

export const usePagination = <T>(
  itemsToPaginate: T[],
  initialItemsPerPage: number = 10
) => {
  const [paginatedItems, setPaginatedItems] = useState(itemsToPaginate);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  let isPaginated = itemsToPaginate.length > itemsPerPage;
  let totalPages = Math.ceil(itemsToPaginate.length / itemsPerPage);

  useEffect(() => {
    isPaginated = itemsToPaginate.length > itemsPerPage;
    totalPages = Math.ceil(itemsToPaginate.length / itemsPerPage);

    if (isPaginated) {
      setPaginatedItems(
        itemsToPaginate.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      );
    }
  }, [itemsToPaginate, currentPage, totalPages]);

  const handleChangeItemsPerPage = (itemsPerPageNewValue: number) => {
    setItemsPerPage(itemsPerPageNewValue);
    setCurrentPage(1);
  };

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleResetPagination = () => {
    setCurrentPage(1);
  };

  return {
    isPaginated,
    paginatedItems,
    currentPage,
    itemsPerPage,
    handleChangePage,
    handleChangeItemsPerPage,
    handleResetPagination,
  };
};
