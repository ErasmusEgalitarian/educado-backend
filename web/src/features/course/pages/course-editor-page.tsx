import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import Layout from "@/shared/components/Layout";
import { Checkbox } from "@/shared/components/shadcn/checkbox";

import { CourseQueryFunction } from "../api/course-queries";
import CourseEditorInformation from "../components/course-editor-information";
import CourseEditorRevise from "../components/course-editor-revise";
import CourseEditorSections from "../components/course-editor-sections";

const CourseEditorPage = () => {
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId?: string }>();
  const isEditMode = courseId !== undefined;

  const { data, error, isLoading } = useQuery({
    ...CourseQueryFunction(courseId ?? ""),
    enabled: isEditMode,
  });

  const [section, setSection] = useState<1 | 2 | 3>(1);

  const handleSectionChange = (sectionNumber: 1 | 2 | 3) => {
    setSection(sectionNumber);
  };

  const getSectionComponent = () => {
    if (error) {
      return (
        <div className="text-red-500">
          Error loading course data: {error.message}
        </div>
      );
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    switch (section) {
      case 1:
        return <CourseEditorInformation course={data} />;
      case 2:
        return <CourseEditorSections />;
      case 3:
        return <CourseEditorRevise />;
      default:
        return null;
    }
  };

  return (
    <Layout meta="Create Course">
      {/*------------ Left side ------------*/}
      <div className="flex p-13 gap-x-20">
        <div className="w-2/7">
          <h1 className="text-2xl text-greyscale-text-caption pb-6 border-b border-greyscale-border-lighter">
            {t("courses.newCourse")}
          </h1>
          <div className="flex flex-col gap-y-5">
            <div className="mt-10 flex gap-x-3 items-center">
              <Checkbox checked={section >= 1} />
              <p className="text-greyscale-text-body">
                {t("createCourse.generalInfo")}
              </p>
            </div>
            <div className="flex gap-x-3 items-center">
              <Checkbox checked={section >= 2} />
              <p className="text-greyscale-text-body">
                {t("createCourse.createSections")}
              </p>
            </div>
            <div className="flex gap-x-3 items-center pb-16 border-b border-greyscale-border-lighter">
              <Checkbox checked={section === 3} />
              <p className="text-greyscale-text-body">
                {t("createCourse.generalInfo")}
              </p>
            </div>
          </div>
        </div>

        {/*------------ Right side ------------*/}
        <div className="w-full">
          <h1 className="font-bold text-3xl text-greyscale-text-title">
            {t("createCourse.generalInfo")}
            {getSectionComponent()}
          </h1>
        </div>
      </div>
    </Layout>
  );
};

export default CourseEditorPage;
