import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Layout from "@/shared/components/Layout";
import { DataDisplay } from "@/shared/data-display/data-display";

import { createCourseColumns } from "../lib/course-columns";
import { CourseCard } from "../components/CourseCard";

const CourseOverviewPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const courseColumns = createCourseColumns({ t, navigate });
  return (
    <Layout meta="course overview">
      <DataDisplay
        baseUrl="https://strapi.ollioddi.dev/api/courses"
        columns={courseColumns}
        queryKey={["courses"]}
        gridItemRender={(course: ApiCourseCourseDocument) => (
          <CourseCard course={course} />
        )}
        fields={["title", "level", "description", "publishedAt"]}
        populate={["cover_image", "course_categories"]}
        initialPageSize={20}
        config={{
          overrideRenderMode: "auto",
          overrideClientModeThreshold: 50,
        }}
      />
    </Layout>
  );
};

export default CourseOverviewPage;
