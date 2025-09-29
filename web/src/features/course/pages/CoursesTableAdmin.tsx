/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { MdStar } from "react-icons/md";
import useSWR from "swr";

import { CoursesDeleteButton } from "@/course/components/CoursesDeleteButton";
import { CoursesUpdateButton } from "@/course/components/CoursesUpdateButton";
import { SearchBar } from "@/shared/components/SearchBar";
import { usePagination } from "@/shared/hooks/usePagination";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  PaginationBottomBar,
} from "@/shared/Table";
import courseService from "@/unplaced/services/course.services";

import { CreatorPopulatedCourse } from "../types/Course";

export const CoursesTableAdmin = () => {
  const [filteredCourses, setFilteredCourses] = useState<
    CreatorPopulatedCourse[]
  >([]);

  const { data: coursesResponse, mutate } = useSWR("api/courses", () =>
    courseService.getAllCourses()
  );

  useEffect(() => {
    if (coursesResponse !== undefined) setFilteredCourses(coursesResponse);
  }, [coursesResponse]);

  //this should be generalized more and turned into a hook
  const searchFunction = (searchString: string) => {
    if (!coursesResponse) return;

    const filteredItems = coursesResponse.filter((course) => {
      if (searchString === "") return course;

      // this will be typed in a better way when a hook is made
      const fieldsToCheck = [
        "title",
        "creator",
        "category",
        "numOfSubscriptions",
        "rating",
      ] as const;

      const user = course.creator?.baseUser;
      if (user) {
        const nameString = `${user.firstName} ${user.lastName}`;
        return nameString.toLowerCase().includes(searchString.toLowerCase());
      }

      return fieldsToCheck.some((field) => {
        const valueToSearch = course[field];

        if (valueToSearch === null || valueToSearch === undefined) return false;

        switch (typeof valueToSearch) {
          case "string":
            return valueToSearch
              .toLowerCase()
              .includes(searchString.toLowerCase());
          case "number":
            return valueToSearch === Number(searchString);
          default:
            return false;
        }
      });
    });
    handleResetPagination();
    setFilteredCourses(filteredItems);
  };

  const {
    isPaginated,
    paginatedItems: paginatedCourses,
    currentPage,
    itemsPerPage,
    handleChangePage,
    handleChangeItemsPerPage,
    handleResetPagination,
  } = usePagination(filteredCourses, 10);

  const rows = paginatedCourses.map((course, key) => {
    const fullName = course.creator?.baseUser
      ? `${course.creator.baseUser.firstName} ${course.creator.baseUser.lastName}`
      : null;

    return (
      //find a nice way to handle react keys
      <TableRow
        key={`${course.title}-${key}`}
        cells={[
          <TableCell>
            <p className="whitespace-normal">{course.title}</p>
          </TableCell>,
          <TableCell>
            {fullName && <p className="whitespace-normal">{fullName}</p>}
          </TableCell>,
          <TableCell>
            {course.category && (
              <p className="whitespace-normal">
                {course.category.charAt(0).toLocaleUpperCase() +
                  course.category.slice(1)}
              </p>
            )}
          </TableCell>,
          <TableCell>
            {course.numOfSubscriptions && (
              <p className="whitespace-normal">{`${course.numOfSubscriptions} alunos`}</p>
            )}
          </TableCell>,
          <TableCell>
            <div className="flex space-x-1">
              <MdStar className="text-yellow-400 self-center" />
              <p className="text-yellow-400 text-lg font-bold">
                {course.rating?.toFixed(1)}
              </p>
            </div>
          </TableCell>,
          <TableCell>
            <div className="flex flex-wrap justify-end gap-2">
              <div>
                <CoursesUpdateButton course={course} refreshFn={mutate} />
              </div>
              <div>
                <CoursesDeleteButton courseId={course._id} refreshFn={mutate} />
              </div>
            </div>
          </TableCell>,
        ]}
      />
    );
  });

  return (
    <TableContainer>
      <SearchBar
        sortingOptions={[
          { displayName: "Mais recentes", htmlValue: "most-recent" },
        ]}
        placeholderText="Buscar Cursos"
        searchFn={searchFunction}
      />
      <Table>
        <TableHead>
          <TableRow
            isHeaderRow
            cells={[
              <TableCell key="name">
                <p>Nome</p>
              </TableCell>,
              <TableCell key="creator">
                <p>Criador de Conteúdo</p>
              </TableCell>,
              <TableCell key="category">
                <p>Categoria</p>
              </TableCell>,
              <TableCell key="subscribers">
                <p>Inscritos</p>
              </TableCell>,
              <TableCell key="rating">
                <p>Nota</p>
              </TableCell>,
              <TableCell key="actions">
                {/* Empty col for actions */}
              </TableCell>,
            ]}
          />
        </TableHead>
        <TableBody>
          {/* Icon context to give all the react-icons in the rows the same options */}
          <IconContext.Provider value={{ size: "20" }}>
            {rows}
          </IconContext.Provider>
        </TableBody>
      </Table>
      {coursesResponse && isPaginated && (
        <PaginationBottomBar
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          unpaginatedItemsAmount={filteredCourses.length}
          onChangePage={handleChangePage}
          onChangeItemsPerPage={handleChangeItemsPerPage}
        />
      )}
    </TableContainer>
  );
};
