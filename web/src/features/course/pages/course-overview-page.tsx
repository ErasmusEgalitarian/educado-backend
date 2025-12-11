import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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

// Lint: move inline icon component out of render scope
const PlusIcon = () => <Icon path={mdiPlus} size={1} />;

const CourseOverviewPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const courseColumns = useMemo(
    () => createCourseColumns({ t, navigate }),
    [t, navigate]
  );

  const courseCard = useCallback(
    (course: Course) => <CourseCard course={course} />,
    []
  );

  const [documentIds, setDocumentIds] = useState<string[]>([]);

  return (
    <PageContainer title={t("courses.pageTitle")}>
      <div className="flex gap-x-20">
        <div className="w-full">
          <Card className="gap-15">
            <CardHeader>
              <CardTitle>
                <h1 className="text-2xl font-bold">{t("courses.pageTitle")}</h1>
              </CardTitle>
              <CardAction>
                <Button
                  variant="primary"
                  iconPlacement="left"
                  icon={PlusIcon}
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
                urlPath="/courses"
                columns={courseColumns}
                queryKey={["courses"]}
                allowedViewModes="both"
                gridItemRender={courseCard}
                fields={
                  [
                    "title",
                    "difficulty",
                    "description",
                    "creator_published_at",
                    "durationHours",
                  ] as (keyof Course)[]
                }
                populate={["course_categories"]}
                config={{
                  renderMode: "client",
                  clientModeThreshold: 50,
                }}
                onFilteredDocumentIds={setDocumentIds}
              />
            </CardContent>
          </Card>
        </div>
        {/* Right sidebar */}
        <CourseOverviewSidebar documentIds={documentIds} />
      </div>
    </PageContainer>
  );
};

export default CourseOverviewPage;
