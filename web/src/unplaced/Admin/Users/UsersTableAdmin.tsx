import { useState, useEffect } from "react";
import Icon from "@mdi/react";
import {
  mdiArrowLeft,
  mdiChevronLeft,
  mdiChevronRight,
  mdiArrowRight,
} from "@mdi/js";
import { useQuery } from "@tanstack/react-query";

import { getUserToken } from "@/auth/lib/userInfo";
import Loading from "@/shared/components/Loading";
import AdminServices from "@/unplaced/services/admin.services";
import ViewUserButton from "@/unplaced/ViewUserButton";
import { ContentCreator } from "@/user/types/ContentCreator";
import { User } from "@/user/types/User";

import AdminToggleButton from "../AdminToggle";
import DeleteUserButton from "../DeleteUserButton";

export const UsersTableAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  type StatusFilter = "all" | "pending" | "approved" | "rejected";

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  const userToken = getUserToken();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user-info", userToken],
    queryFn: () => AdminServices.getUserApplications(userToken),
    enabled: !!userToken,
  });

  if (isLoading || !data) return <Loading />;

  if (isError) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-red-500">Erro ao carregar usuários.</p>
      </div>
    );
  }

  const refreshUsers = () => {
    void refetch();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    let formattedDate = date
      .toLocaleString("pt-BR", options)
      .replace(" às", "");
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    return formattedDate;
  };

  type UserRecord = User & ContentCreator;

  const getStatusColor = (application: UserRecord) => {
    if (application.approved) return "green";
    if (application.rejected) return "red";
    return "black";
  };

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

  const filteredBySearch = data.filter((userRecord) => {
    // this will be typed in a better way when a hook is made
    const fieldsToCheck = ["firstName", "lastName", "email"] as const;

    return fieldsToCheck.some((field) => {
      const valueToCheck = userRecord[field];
      if (valueToCheck === null || valueToCheck === undefined) return false;

      return valueToCheck.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

    const filteredData = filteredBySearch.filter((userRecord) => {
        switch (statusFilter) {
            case "approved":
                return userRecord.approved === true;
            case "rejected":
                return userRecord.rejected === true;
            case "pending":
                return !userRecord.approved && !userRecord.rejected;
            case "all":
            default:
                return true;
        }
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, filteredData.length);

  return (
    <div>
      <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-full md:space-x-4 space-y-3 md:space-y-0 justify-end py-6 -mt-4">
        <select className="block bg-white min-w-[175px] grow-0 border border-slate-300 rounded-md py-2 pr-3 shadow-xs focus:outline-hidden hover:bg-white focus:border-sky-500 focus:ring-1 sm:text-sm">
          <option value="option1">Mais recentes</option>
        </select>
        <div className="relative min-w-[225px] grow-0">
          <input
            className="placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pr-3 shadow-xs focus:outline-hidden hover:bg-white focus:border-sky-500 focus:ring-1 sm:text-sm"
            type="text"
            id="search-term"
            placeholder="Buscar usuário"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </form>

        <div className="flex flex-wrap items-center justify-between pb-4">
            <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs md:text-sm font-semibold">
                <button
                    type="button"
                    className={
                        "px-3 md:px-4 py-1 rounded-full transition " +
                        (statusFilter === "all"
                            ? "bg-teal-600 text-white"
                            : "text-slate-600 hover:text-slate-800")
                    }
                    onClick={() => setStatusFilter("all")}
                >
                    Todos
                </button>

                <button
                    type="button"
                    className={
                        "px-3 md:px-4 py-1 rounded-full transition " +
                        (statusFilter === "pending"
                            ? "bg-teal-600 text-white"
                            : "text-slate-600 hover:text-slate-800")
                    }
                    onClick={() => setStatusFilter("pending")}
                >
                    Pendentes
                </button>

                <button
                    type="button"
                    className={
                        "px-3 md:px-4 py-1 rounded-full transition " +
                        (statusFilter === "approved"
                            ? "bg-teal-600 text-white"
                            : "text-slate-600 hover:text-slate-800")
                    }
                    onClick={() => setStatusFilter("approved")}
                >
                    Aprovados
                </button>

                <button
                    type="button"
                    className={
                        "px-3 md:px-4 py-1 rounded-full transition " +
                        (statusFilter === "rejected"
                            ? "bg-teal-600 text-white"
                            : "text-slate-600 hover:text-slate-800")
                    }
                    onClick={() => setStatusFilter("rejected")}
                >
                    Recusados
                </button>
            </div>
        </div>

      <table className="w-full leading-normal mx-auto">
        <thead>
          <tr className="bg-white border-b-4 border-[#166276] text-[#166276] text-left text-base font-base font-['Lato']]">
            <th scope="col" className="p-7" style={{ width: "5%" }}>
              Admin
            </th>
            <th scope="col" className="p-5" style={{ width: "20%" }}>
              Nome
            </th>
            <th scope="col" className="p-5" style={{ width: "25%" }}>
              Email
            </th>
            <th scope="col" className="p-5" style={{ width: "20%" }}>
              Status
            </th>
            <th scope="col" className="p-5" style={{ width: "30%" }}>
              Enviado em
            </th>
            <th scope="col" className="p-5" style={{ width: "30%" }} />
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((userRecord: UserRecord, key: number) => {
            return (
              <tr
                key={key}
                className="px-5 py-5 border-b border-gray-300 bg-white text-base font-['Montserrat']"
              >
                <td>
                  <AdminToggleButton
                    applicationId={userRecord._id}
                    applicationApproved={userRecord.approved}
                  />
                </td>
                <td>
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p
                        className="text-gray-900 whitespace-no-wrap"
                        id="name"
                        style={{ wordBreak: "break-word" }}
                      >
                        {userRecord.firstName} {userRecord.lastName}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ wordBreak: "break-word" }}>
                  <p className="text-gray-900 whitespace-no-wrap" id="email">
                    {userRecord.email}
                  </p>
                </td>
                <td>
                  <p
                    className="text-gray-900 whitespace-no-wrap"
                    id="status"
                    style={{ color: getStatusColor(userRecord) }}
                  >
                    {userRecord.approved
                      ? "Aprovado"
                      : userRecord.rejected
                        ? "Recusado"
                        : "Aguardando análise"}
                  </p>
                </td>
                <td>
                  <p className="text-gray-900" id="date">
                    {formatDate(userRecord.joinedAt)}
                  </p>
                </td>
                <td>
                  <div className="flex items-center p-4">
                    {userRecord.approved || userRecord.rejected ? (
                      <>
                        <ViewUserButton
                          applicationId={userRecord._id}
                          onHandleStatus={refreshUsers}
                        />
                        <div className="mx-2.5" />
                        <DeleteUserButton
                          applicationId={userRecord._id}
                          onDelete={refreshUsers}
                        />
                        <div className="-ml-8" />
                      </>
                    ) : (
                      <div className="ml-auto -mr-2">
                        <ViewUserButton
                          applicationId={userRecord._id}
                          onHandleStatus={refreshUsers}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="px-5 bg-white py-5 flex flex-row xs:flex-row items-center xs:justify-between justify-end">
        <div className="flex items-center">
          <span className="text-gray-600">Rows per page:</span>
          <div className="relative">
            <select
              className="appearance-none bg-none border-none text-gray-600 focus:ring-0 cursor-pointer"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
            <svg
              className="absolute right-6 top-1/2 transform -translate-y-1/2 h-4 w-3.5 text-gray-600 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <span className="text-gray-600 mx-2 ml-8">
            {startItem} - {endItem} of {filteredData.length}
          </span>
        </div>
        <div className="flex items-center ml-8">
          <button
            type="button"
            className={`w-full p-3 text-base ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 bg-white hover:bg-gray-100 cursor-pointer"
            }`}
            onClick={handleFirstPage}
          >
            <Icon path={mdiArrowLeft} size={0.9} color="currentColor" />
          </button>
          <button
            type="button"
            className={`w-full p-3 text-base ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 bg-white hover:bg-gray-100 cursor-pointer"
            }`}
            onClick={() => {
              handlePageChange(currentPage - 1);
            }}
          >
            <Icon path={mdiChevronLeft} size={0.9} color="currentColor" />
          </button>
          <button
            type="button"
            className={`w-full p-3 text-base ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 bg-white hover:bg-gray-100 cursor-pointer"
            }`}
            onClick={() => {
              handlePageChange(currentPage + 1);
            }}
          >
            <Icon path={mdiChevronRight} size={0.9} color="currentColor" />
          </button>
          <button
            type="button"
            className={`w-full p-3 text-base ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 bg-white hover:bg-gray-100 cursor-pointer"
            }`}
            onClick={handleLastPage}
          >
            <Icon path={mdiArrowRight} size={0.9} color="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};
