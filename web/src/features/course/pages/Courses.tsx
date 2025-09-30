// Hooks
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import noCoursesImage from "@/shared/assets/no-courses.png";
import CourseServices from "@/unplaced/services/course.services";

import Layout from "../../../shared/components/Layout";
import Loading from "../../../shared/components/Loading";
import { getUserToken } from "../../auth/lib/userInfo";
import { CourseGridCard } from "../components/CourseGridCard";
import { CourseListCard } from "../components/CourseListCard";
import PersonalInsights from "../components/PersonalInsights";

/**
 * @returns HTML Element
 *
 * This page displays all courses created by the user\
 * as well as some personal insights about the user.
 */
const Courses = () => {
  const [isGridView, setIsGridView] = useState(true); // Default to Grid View
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("newest");
  // States and Hooks
  const navigate = useNavigate();
  const token = getUserToken();
  // Fetch all courses

  // TODO: Implement proper backend call once backend is ready

  const CourseManager = () => {
    navigate("/courses/manager/0/0");
  };

  const [showTutorial, setShowTutorial] = useState(false);

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  const { data, error } = useSWR(
    token ? [token] : null,
    CourseServices.getAllCreatorCourses
  );

  // Filter courses based on the search term
  useEffect(() => {
    filterAndSortCourses(data, searchTerm, selectedFilter, setFilteredCourses);
  }, [searchTerm, data, selectedFilter]);

  function filterAndSortCourses(
    data: any,
    searchTerm: string,
    selectedFilter: string,
    setFilteredCourses: any
  ) {
    if (data && Array.isArray(data)) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = data.filter(
        (item: any) =>
          item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.category.toLowerCase().includes(lowerCaseSearchTerm)
      );

      // Apply sorting based on selected filter
      switch (selectedFilter) {
        case "newest":
          filtered.sort(
            (a: any, b: any) =>
              new Date(b.dateCreated).getTime() -
              new Date(a.dateCreated).getTime()
          );
          break;
        case "oldest":
          filtered.sort(
            (a: any, b: any) =>
              new Date(a.dateCreated).getTime() -
              new Date(b.dateCreated).getTime()
          );
          break;
        case "popular":
          filtered.sort(
            (a: any, b: any) => b.numOfSubscriptions - a.numOfSubscriptions
          );
          break;
        default:
          break; // 'all' case doesn't need additional sorting
      }

      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }

  if (error && error.response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
    return null;
  }

  if (!data)
    return (
      <Layout meta="course overview">
        <Loading />
      </Layout>
    );

  const handleGridOrList = (view: any) => {
    setIsGridView(view === "grid");
  };

  return (
    <Layout meta="Course overview">
      <div className="grid lg:grid-cols-[3fr_1fr] h-full font-personalInsights">
        {/* Left side displaying courses, filtering for these and create new button */}
        <div className="m-8 p-8 pb-0 bg-white rounded-xl overflow-hidden flex flex-col">
          {data.length > 0 ? (
            <>
              {/* Header and create course button */}
              <div className="flex flex-row no-wrap items-center">
                <h1 className="text-3xl font-bold flex-1">
                  Confira seus cursos
                </h1>
                <div className="flex flex-row gap-5">
                  <label
                    htmlFor="course-create"
                    onClick={CourseManager}
                    className="std-button flex modal-button space-x-2 cursor-pointer px-12 py-2.5"
                  >
                    <p className="font-normal flex items-center ">
                      <span className="text-3xl mr-2">+</span> Novo Curso
                    </p>
                    {/** Create new course */}
                  </label>
                  {/* Course guide button shows a tutorial*/}
                  {/* <CourseGuideButton /> */}
                </div>
              </div>
              {/* Card/compact view toggle and filters */}
              <div className="my-8 flex justify-between">
                {/* TODO: Implement card/compact view toggle */}
                <div className="flex ">
                  <button
                    onClick={() => {
                      handleGridOrList("grid");
                    }}
                  >
                    <div
                      id="GridView"
                      className={`p-2 rounded-l-lg border border-grayLight ${isGridView ? "bg-primary" : ""}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 12C9.1 12 10 12.9 10 14C10 15.1 9.1 16 8 16C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12ZM8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6ZM8 0C9.1 0 10 0.9 10 2C10 3.1 9.1 4 8 4C6.9 4 6 3.1 6 2C6 0.9 6.9 0 8 0ZM2 12C3.1 12 4 12.9 4 14C4 15.1 3.1 16 2 16C0.9 16 0 15.1 0 14C0 12.9 0.9 12 2 12ZM2 6C3.1 6 4 6.9 4 8C4 9.1 3.1 10 2 10C0.9 10 0 9.1 0 8C0 6.9 0.9 6 2 6ZM2 0C3.1 0 4 0.9 4 2C4 3.1 3.1 4 2 4C0.9 4 0 3.1 0 2C0 0.9 0.9 0 2 0ZM14 12C15.1 12 16 12.9 16 14C16 15.1 15.1 16 14 16C12.9 16 12 15.1 12 14C12 12.9 12.9 12 14 12ZM14 6C15.1 6 16 6.9 16 8C16 9.1 15.1 10 14 10C12.9 10 12 9.1 12 8C12 6.9 12.9 6 14 6ZM14 0C15.1 0 16 0.9 16 2C16 3.1 15.1 4 14 4C12.9 4 12 3.1 12 2C12 0.9 12.9 0 14 0Z"
                          fill={isGridView ? "#FFF" : "#A1ACB2"}
                        />
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleGridOrList("list");
                    }}
                  >
                    <div
                      id="ListView"
                      className={`p-2 rounded-r-lg border border-grayLight ${!isGridView ? "bg-primary" : ""}`}
                    >
                      <svg
                        width="18"
                        height="16"
                        viewBox="0 0 18 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0H4V4H0V0ZM6 1V3H18V1H6ZM0 6H4V10H0V6ZM6 7V9H18V7H6ZM0 12H4V16H0V12ZM6 13V15H18V13H6Z"
                          fill={!isGridView ? "#FFF" : "#A1ACB2"}
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-full md:space-x-4 space-y-3 md:space-y-0 justify-end py-6">
                  <div className="relative min-w-[225px] flex-grow-0">
                    <input
                      className="placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none hover:bg-white focus:border-sky-500 focus:ring-1 sm:text-sm"
                      type="text"
                      id="search-term"
                      placeholder="Buscar curso"
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
                  <select
                    onChange={(event) => {
                      setSelectedFilter(event.target.value);
                    }}
                    className="block bg-white min-w-[175px] flex-grow-0 border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none hover:bg-white focus:border-sky-500 focus:ring-1 sm:text-sm"
                  >
                    <option value="newest">Últimos incluídos</option>
                    <option value="oldest">Mais antigos</option>
                    <option value="popular">Mais populares</option>
                  </select>
                </form>
              </div>
              <div className="overflow-y-scroll no-scrollbar">
                {isGridView ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6 pb-4">
                    {filteredCourses.map((course: any, key: number) => (
                      <CourseGridCard course={course} key={key} />
                    ))}
                  </div>
                ) : (
                  <table className="w-[100%] leading-normal mx-auto">
                    <thead>
                      <tr className="bg-white border-b-4 border-[#166276] text-[#166276] text-left text-base font-base font-['Lato']]">
                        <th
                          scope="col"
                          className="p-7"
                          style={{ width: "20%" }}
                        >
                          Nome
                        </th>
                        <th
                          scope="col"
                          className="p-5"
                          style={{ width: "20%" }}
                        >
                          Categoria
                        </th>
                        <th
                          scope="col"
                          className="p-5"
                          style={{ width: "25%" }}
                        >
                          Carga Horária
                        </th>
                        <th
                          scope="col"
                          className="p-5"
                          style={{ width: "20%" }}
                        >
                          Inscritos
                        </th>
                        <th
                          scope="col"
                          className="p-5"
                          style={{ width: "30%" }}
                        >
                          Nota
                        </th>
                        <th
                          scope="col"
                          className="p-5"
                          style={{ width: "5%" }}
                        />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((course: any, key: number) => (
                        <CourseListCard course={course} key={key} />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            // If the user has no courses, display this 'empty state'
            <div className="grid place-content-center w-full h-full text-center">
              <div className="md:mx-40 xl:mx-64">
                <img src={noCoursesImage} className="w-full" />
                <h1 className="text-xl font-bold my-4">Comece agora</h1>
                {/* You haven't created any courses yet.
              Click the button below and follow the
              step-by-step instructions to develop your first course. */}
                <p>
                  Você ainda não criou nenhum curso. Clique no botão abaixo e
                  siga o passo a passo para desenolver o seu primeiro curso.
                </p>
                {/* Create course button */}
                <label
                  htmlFor="course-create"
                  onClick={CourseManager}
                  className="std-button flex modal-button  space-x-2"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  <p className="font-normal ">Criar novo curso</p>{" "}
                  {/** Create new course */}
                </label>
              </div>
            </div>
          )}
        </div>
        {/* Right side displaying personal insights */}
        <div className="m-8 hidden lg:block">
          <PersonalInsights courses={data} />
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
