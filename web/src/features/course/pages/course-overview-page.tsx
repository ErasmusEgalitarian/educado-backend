import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Course } from "@/shared/api/types.gen";
import { PageContainer } from "@/shared/components/page-container";
import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";
import { DataDisplay } from "@/shared/data-display/data-display";

import { CourseCard } from "../components/course-card";
import CourseOverviewSidebar from "../components/course-overview-sidebar";
import { createCourseColumns } from "../lib/course-columns";

const CourseOverviewPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const courseColumns = useMemo(
    () => createCourseColumns({ t, navigate }),
    [t, navigate]
  );

  const courseCard = useCallback(
    (course: Course) => <CourseCard course={course} />,
    []
  );

  const handleSelectionChange = useCallback((courses: Course[]) => {
    setSelectedCourses(courses);
    // Do something with selected courses (e.g., enable batch operations)
    toast.info(`${String(courses.length)} course(s) selected.`);
  }, []);

  return (
    <PageContainer title={t("courses.pageTitle")}>
      <div className="flex gap-x-20">
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>
                <h1 className="text-2xl font-bold">{t("courses.pageTitle")}</h1>
              </CardTitle>
              <CardAction>
                <Button
                  variant="primary"
                  iconPlacement="left"
                  icon={() => <Icon path={mdiPlus} size={1} />}
                  onClick={() => {
                    navigate("create");
                  }}
                >
                  {t("courses.newCourse")}
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <DataDisplay<Course>
                urlPath="/courses?publicationState=preview"
                columns={courseColumns}
                queryKey={["courses"]}
                allowedViewModes="both"
                gridItemRender={courseCard}
                fields={
                  [
                    "title",
                    "difficulty",
                    "description",
                    "durationHours",
                    "publishedAt",
                  ] as (keyof Course)[]
                }
                populate={["course_categories"]}
                config={{
                  renderMode: "client",
                  clientModeThreshold: 50,
                }}
                selection={{
                  enabled: true,
                  limit: 2,
                  onChange: handleSelectionChange,
                }}
              />
              {/* Display selected courses count for demo */}
              {selectedCourses.length > 0 && (
                <div className="mt-4 p-4 bg-primary-surface-lighter rounded-lg">
                  <p className="text-sm font-medium">
                    {selectedCourses.length} course(s) selected:{" "}
                    {selectedCourses.map((c) => c.title).join(", ")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Right sidebar */}
        <CourseOverviewSidebar />
      </div>
    </PageContainer>
  );
};

export default CourseOverviewPage;
