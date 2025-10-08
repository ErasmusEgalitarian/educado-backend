import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ApiCourseCourseDocument } from "@/shared/api";
import { PageContainer } from "@/shared/components/page-container";
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
    <PageContainer title={t("courseOverviewPage.title")}>
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
          overrideRenderMode: "client",
          overrideClientModeThreshold: 50,
        }}
      />
    </PageContainer>
  );
};

export default CourseOverviewPage;
