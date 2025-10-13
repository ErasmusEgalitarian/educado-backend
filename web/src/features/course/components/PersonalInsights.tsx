import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import StarRating from "../../../shared/components/star-rating";
import { getAverageRatingOfCC } from "../../../unplaced/services/contentCreator.services";
import { getUserInfo } from "../../auth/lib/userInfo";
import { getNumberOfCourses, getTotalSubscriberCount } from "../lib/courses";
import { Course } from "../types/Course";

// Helper functions

interface PersonalInsightsProps {
  courses: Course[];
}

const userInfo = getUserInfo();

/**
 * @param props
 * @param props.courses
 * @returns HTML Element
 *
 * This component displays personal insights about the user.
 * (Right side of the Courses page at the time of writing)
 */
const PersonalInsights = (props: PersonalInsightsProps) => {
  const courses = props.courses ?? [];
  const [averageRating, setAverageRating] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const { t } = useTranslation();
  // Helper function to filter courses by date
  const filterCoursesByPeriod = (courses: Course[], period: string) => {
    const now = new Date();
    const filtered = courses.filter((course) => {
      // Check if dateCreated exists before creating Date object
      if (!course.dateCreated) return true;

      const courseDate = new Date(course.dateCreated);
      switch (period) {
        case "this_month":
          return (
            courseDate.getMonth() === now.getMonth() &&
            courseDate.getFullYear() === now.getFullYear()
          );
        case "last_month":
          const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
          return (
            courseDate.getMonth() === lastMonth.getMonth() &&
            courseDate.getFullYear() === lastMonth.getFullYear()
          );
        case "7_days":
          const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
          return courseDate >= sevenDaysAgo;
        case "this_year":
          return courseDate.getFullYear() === now.getFullYear();
        default:
          return true; // 'all' case
      }
    });
    return filtered;
  };

  // Get filtered statistics
  const getFilteredStats = () => {
    const filteredCourses = filterCoursesByPeriod(courses, selectedPeriod);
    return {
      totalCourses: getNumberOfCourses(filteredCourses),
      totalStudents: getTotalSubscriberCount(filteredCourses),
      // You'll need to implement similar logic for certificates
      totalCertificates: 0, // TODO: Implement certificate filtering
      // Rating might need to be fetched from backend with period parameter
      rating: averageRating,
    };
  };

  // Get current stats
  const stats = getFilteredStats();

  useEffect(() => {
    async function fetchAverageRating() {
      const rating = await getAverageRatingOfCC(userInfo.id, selectedPeriod);
      setAverageRating(rating);
    }
    fetchAverageRating();
  }, [selectedPeriod]);

  return (
    <div className="w-full h-full">
      {/* Welcome message */}
      <h2 className="text-xl font-bold">
        {t("courses.hello")} {userInfo.firstName} {userInfo.lastName}
      </h2>
      {/* Progress section (stats) */}
      <div className="border-y border-grayMedium my-4 py-4">
        <div className="grid grid-cols-4 lg:grid-cols-1 gap-y-4">
          {/* Show stats if the user has > 0 courses */}
          {
            courses.length > 0 ? (
              <>
                <div>
                  {/* Dropdown menu */}
                  <div className="flex items-center">
                    <p className="mr-2 text-grayMedium text-lg">
                      {t("courses.progress")}:
                    </p>
                    <select
                      className="p-1 rounded-md border-grayLight"
                      id="courseStatus"
                      value={selectedPeriod}
                      onChange={(e) => {
                        setSelectedPeriod(e.target.value);
                      }}
                    >
                      <option value="all">Todo tempo</option>
                      <option value="this_month">Esse més</option>
                      <option value="last_month">Més passado</option>
                      <option value="7_days">Últimos 7 dias</option>
                      <option value="this_year">Essé ano</option>
                    </select>
                  </div>
                </div>
                <div>
                  {/* Total courses */}
                  <div className="">
                    <p className="font-normal text-lg">
                      {t("courses.totalCourses")}:
                    </p>
                    <p className="font-bold" id="courseAmount">
                      {stats.totalCourses}
                    </p>
                  </div>
                </div>
                <div>
                  {/* Total students */}
                  <p className="font-normal text-lg">
                    {t("courses.totalStudents")}:
                  </p>
                  <p className="font-bold" id="subscribers">
                    {stats.totalStudents}
                  </p>
                </div>
                <div>
                  {/* Total certificados */}{" "}
                  {/* TO DO: get total amount of certificates that have been giving out */}
                  <p className="font-normal text-lg">
                    {t("courses.totalCertificates")}:
                  </p>
                  <p className="font-bold" id="certificateAmount">
                    {stats.totalCertificates}
                  </p>
                </div>
                <div>
                  {/* Rating */}
                  <p className="font-normal text-lg">
                    {t("courses.avalation")}:
                  </p>
                  <div className="w-48 max-w-full">
                    <StarRating
                      testId="averageRating"
                      rating={stats.rating}
                      className="text-2xl font-bold"
                    />
                  </div>
                </div>
                {/* If the user has 0 courses */}
              </>
            ) : (
              <p className="italic" id="noCourses">
                Não há dados suficiente
              </p>
            ) /* There's not enough data */
          }
        </div>
      </div>
      {/* Activities section */}
      <div>
        <p className="font-bold">{t("courses.activities")}</p>
        <div className="grid grid-cols-4 lg:grid-cols-1 gap-y-2">
          {/* Show activities if the user has > 0 courses */}
          {
            courses.length > 0 ? (
              <>{/* If the user has 0 courses */}</>
            ) : (
              <p className="italic">Nenhuma atividade</p>
            ) /* No activities */
          }
        </div>
      </div>
    </div>
  );
};

export default PersonalInsights;
