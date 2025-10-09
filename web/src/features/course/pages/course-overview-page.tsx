import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ApiCourseCourseDocument } from "@/shared/api";
import { PageContainer } from "@/shared/components/page-container";
import { Button } from "@/shared/components/shadcn/button";
import { DataDisplay } from "@/shared/data-display/data-display";

import { CourseCard } from "../components/CourseCard";
import { createCourseColumns } from "../lib/course-columns";

const CourseOverviewPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const courseColumns = createCourseColumns({ t, navigate });

  const courseCard = (course: ApiCourseCourseDocument) => (
    <CourseCard course={course} />
  );

  return (
    <PageContainer title={t("courses.pageTitle")}>
      <div className="mb-4 flex items-center justify-between">
        <h1>{t("courses.pageHeader")}</h1>
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
      </div>
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
    </PageContainer>
  );
};

export default CourseOverviewPage;
