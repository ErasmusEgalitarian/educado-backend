import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ApiCourseCourseDocument } from "@/shared/api";
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

  const courseColumns = useMemo(
    () => createCourseColumns({ t, navigate }),
    [t, navigate]
  );

  const courseCard = useCallback(
    (course: ApiCourseCourseDocument) => <CourseCard course={course} />,
    []
  );

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
              <DataDisplay
                urlPath="/courses"
                columns={courseColumns}
                queryKey={["courses"]}
                allowedViewModes="both"
                gridItemRender={courseCard}
                fields={["title", "difficulty", "description"]}
                populate={["course_categories"]}
                initialPageSize={20}
                config={{
                  renderMode: "client",
                  clientModeThreshold: 50,
                }}
              />
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
