import { useState } from "react";
import Layout from "../components/Layout";

import { InstitutionsTableAdmin } from "../components/Admin/Institutions/InstitutionsTableAdmin";
import { UsersTableAdmin } from "../components/Admin/Users/UsersTableAdmin";
import { CoursesTableAdmin } from "@components/Admin/Courses/CoursesTableAdmin";

const EducadoAdmin = () => {
  type TableOptions = "users" | "institutions" | "courses";
  const [selectedTable, setSelectedTable] = useState<TableOptions>("users");

  let activeTable;
  switch (selectedTable) {
    case "users":
      activeTable = <UsersTableAdmin />;
      break;
    case "institutions":
      activeTable = <InstitutionsTableAdmin />;
      break;
    case "courses":
      activeTable = <CoursesTableAdmin />;
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
            onClick={() => setSelectedTable("users")}
          >
            <span>Usuários</span>
          </button>
          <button
            id="InstitutionsButton"
            className={`flex-1 py-3 ${
              selectedTable === "institutions"
                ? ""
                : "bg-white text-normal font-normal text-[#166276]"
            }`}
            onClick={() => setSelectedTable("institutions")}
          >
            <span>Instituições</span>
          </button>
          <button
            id="courses-button"
            className={`flex-1 py-3 ${
              selectedTable === "courses"
                ? ""
                : "bg-white text-normal font-normal text-[#166276]"
            }`}
            onClick={() => setSelectedTable("courses")}
          >
            <span>Cursos</span>
          </button>
        </div>
        {activeTable}
      </div>
    </Layout>
  );
};

export default EducadoAdmin;
