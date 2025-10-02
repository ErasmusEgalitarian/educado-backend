import { useState } from "react";
import {
  GoArrowLeft,
  GoArrowRight,
  GoChevronLeft,
  GoChevronRight,
} from "react-icons/go";
import { IconContext } from "react-icons/lib";
import { MdSearch } from "react-icons/md";
import useSWR from "swr";

import { getUserToken } from "@/auth/lib/userInfo";
import Loading from "@/shared/components/Loading";
import { institutionService } from "@/unplaced/services/Institution.services";

import { AddInstitutionButton } from "./Actions/AddInstitutionsButton";
import { DeleteInstitutionButton } from "./Actions/DeleteInstitutionsButton";
import { UpdateInstitutionButton } from "./Actions/UpdateInstitutionsButton";

export const InstitutionsTableAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const userToken = getUserToken();
  const { data: institutionsResponse, mutate } = useSWR(
    "api/institutions",
    () => institutionService.getInstitutions(userToken)
  );

  if (!institutionsResponse) return <Loading />;

  const filteredData = institutionsResponse.filter((institution) => {
    if (searchTerm === "") return institution;

    // this will be typed in a better way when a hook is made
    const fieldsToCheck = [
      "institutionName",
      "domain",
      "secondaryDomain",
    ] as const;

    return fieldsToCheck.some((field) => {
      const valueToCheck = institution[field];

      if (valueToCheck === null || valueToCheck === undefined) return false;

      return valueToCheck.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, filteredData.length);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const columnNames = [
    { name: "Instituições", width: "basis-1/4" },
    { name: "Domínio", width: "basis-1/4" },
    { name: "Domínio secundário", width: "basis-1/4" },
  ];

  return (
    <div className="container mx-auto flex flex-col overflow-hidden gap-6">
      <div className="flex flex-wrap justify-end gap-2">
        <select className="select select-bordered">
          <option value="most-recent">Mais recentes</option>
        </select>
        <div className="flex flex-row">
          <input
            className="input input-bordered"
            type="text"
            placeholder="Buscar Instituições"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
          <div className="flex flex-col justify-center">
            <MdSearch className="-ml-6" />
          </div>
        </div>
        <AddInstitutionButton />
      </div>

      <table className="table w-full">
        <thead>
          <tr className="border-b-4 border-primary text-primary">
            {columnNames.map((columnName, key) => (
              <th
                scope="col"
                className={`text-sm bg-transparent ${columnName.width}`}
                key={`${columnName.name}-${key}`}
              >
                {columnName.name}
              </th>
            ))}
            {/* ACTION BUTTONS */}
            <th scope="col" className="bg-transparent basis-1/6" />
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((institution, key) => {
            return (
              <tr key={key} className="border-b-2">
                <td>
                  <p>{institution.institutionName}</p>
                </td>
                <td>
                  <p>{institution.domain}</p>
                </td>
                <td>
                  <p>{institution.secondaryDomain}</p>
                </td>
                <td>
                  <div className="flex flex-wrap justify-end gap-2">
                    <IconContext.Provider value={{ size: "20" }}>
                      <div>
                        <UpdateInstitutionButton
                          institution={institution}
                          refreshFn={mutate}
                        />
                      </div>
                      <div>
                        <DeleteInstitutionButton
                          institutionId={institution._id!}
                          refreshFn={mutate}
                        />
                      </div>
                    </IconContext.Provider>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex flex-row space-x-8 justify-end">
        <div className="flex items-center">
          <span className="text-gray-600">Rows per page:</span>
          <div>
            <select
              className="select"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
          <span className="text-gray-600">
            {startItem} - {endItem} of {filteredData.length}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <IconContext.Provider value={{ size: "20" }}>
            <button
              type="button"
              disabled={currentPage === 1}
              className={
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }
              onClick={handleFirstPage}
            >
              <GoArrowLeft />
            </button>
            <button
              type="button"
              className={
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }
              onClick={() => {
                handlePageChange(currentPage - 1);
              }}
            >
              <GoChevronLeft />
            </button>
            <button
              type="button"
              className={
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }
              onClick={() => {
                handlePageChange(currentPage + 1);
              }}
            >
              <GoChevronRight />
            </button>
            <button
              type="button"
              className={
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }
              onClick={handleLastPage}
            >
              <GoArrowRight />
            </button>
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
};
