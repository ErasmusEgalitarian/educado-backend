import { ReactElement } from "react";
import { IconContext } from "react-icons";
import {
  GoArrowLeft,
  GoChevronLeft,
  GoChevronRight,
  GoArrowRight,
} from "react-icons/go";

interface PaginationBottomBatProps {
  currentPage: number;
  itemsPerPage: number;
  unpaginatedItemsAmount: number;
  onChangePage: (newPageNumber: number) => void;
  onChangeItemsPerPage: (itemsPerPage: number) => void;
}

export const PaginationBottomBar = ({
  currentPage,
  itemsPerPage,
  unpaginatedItemsAmount: itemsAmount,
  onChangePage,
  onChangeItemsPerPage,
}: PaginationBottomBatProps) => {
  const pageStartItem = (currentPage - 1) * itemsPerPage + 1;
  //Math min so the pageEndItem cannot be larger than itemsAmount
  const pageEndItem = Math.min(currentPage * itemsPerPage, itemsAmount);
  const totalPages = Math.ceil(itemsAmount / itemsPerPage);

  return (
    <div className="flex flex-row space-x-8 justify-end">
      <div className="flex items-center">
        <span className="text-gray-600">Rows per page:</span>
        <div>
          <select
            className="select"
            value={itemsPerPage}
            onChange={(event) =>
              onChangeItemsPerPage(Number(event.target.value))
            }
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
        <span className="text-gray-600">
          {`${pageStartItem} - ${pageEndItem} of ${itemsAmount}`}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <IconContext.Provider value={{ size: "20" }}>
          <NavigationButton
            isDisabled={currentPage === 1}
            onPageChange={() => onChangePage(1)}
            icon={<GoArrowLeft />}
          />

          <NavigationButton
            isDisabled={currentPage === 1}
            onPageChange={() => onChangePage(currentPage - 1)}
            icon={<GoChevronLeft />}
          />

          <NavigationButton
            isDisabled={currentPage === totalPages}
            onPageChange={() => onChangePage(currentPage + 1)}
            icon={<GoChevronRight />}
          />

          <NavigationButton
            isDisabled={currentPage === totalPages}
            onPageChange={() => onChangePage(totalPages)}
            icon={<GoArrowRight />}
          />
        </IconContext.Provider>
      </div>
    </div>
  );
};

const NavigationButton = ({
  isDisabled,
  onPageChange,
  icon,
}: {
  isDisabled: boolean;
  onPageChange: () => void;
  icon: ReactElement;
}) => {
  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`${
        isDisabled
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-100 cursor-pointer"
      }`}
      onClick={onPageChange}
    >
      {icon}
    </button>
  );
};
