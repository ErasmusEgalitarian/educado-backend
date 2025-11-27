import { useState } from "react";

import Layout from "../shared/components/Layout";
import { InstitutionsTableAdmin } from "./Admin/Institutions/InstitutionsTableAdmin";
import { UsersTableAdmin } from "./Admin/Users/UsersTableAdmin";

const EducadoAdmin = () => {
  type TableOptions = "users" | "institutions";
  const [selectedTable, setSelectedTable] = useState<TableOptions>("users");

  let activeTable;
  switch (selectedTable) {
    case "users":
      activeTable = <UsersTableAdmin />;
      break;
    case "institutions":
      activeTable = <InstitutionsTableAdmin />;
      break;
    default:
      break;
  }

  return (
    <Layout meta="Educado Admin">
      <div className="container mx-auto flex-col space-y-8 shadow-md rounded-xl bg-white p-10 m-10 font-['Montserrat']">
        <div className="btn-group flex text-center text-base font-semibold text-white bg-[#166276] border-b-2 border-b-[#166276]">
          <button
            className={`flex-1 py-3 ${
              selectedTable === "users"
                ? ""
                : "bg-white text-normal font-normal text-[#166276]"
            }`}
            onClick={() => {
              setSelectedTable("users");
            }}
          >
            <span>Users</span>
          </button>
          <button
            id="InstitutionsButton"
            className={`flex-1 py-3 ${
              selectedTable === "institutions"
                ? ""
                : "bg-white text-normal font-normal text-[#166276]"
            }`}
            onClick={() => {
              setSelectedTable("institutions");
            }}
          >
            <span>Institutions</span>
          </button>
        </div>
        {activeTable}
      </div>
    </Layout>
  );
};

export default EducadoAdmin;
