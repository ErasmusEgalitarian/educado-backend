import Layout from "@/shared/components/Layout";
import categories from "@/course/types/courseCategories";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { Button } from "@/shared/components/shadcn/button";
import { Form } from "@/shared/components/shadcn/form";
import { Dropzone } from "@/shared/components/dnd/Dropzone";

import {
  CourseBasicInfoFormValues,
  courseBasicInfoSchema,
} from "@/course/lib/courseValidationSchema";

const Checkbox = ({ isChecked, isActive }: { isChecked: boolean; isActive: boolean }) => {
  return (
    <div className={`${isActive ? "pl-4 border-l-2 border-gray-700" : ""}`}>
      <input
        className={"w-4 h-4 border-2 border-primary-surface-subtle rounded"}
        style={{
          accentColor: 'var(--primary-surface-default)'
        }}
        type="checkbox"
        checked={isChecked}
        readOnly
      />
    </div>
  );
};


const CreateCourse = () => {
  const { t } = useTranslation();

  // Init form with React Hook Form + Zod
  const form = useForm<CourseBasicInfoFormValues>({
    resolver: zodResolver(courseBasicInfoSchema),
    defaultValues: {
      title: "",
      difficulty: 0,
      category: "",
      description: "",
    },
    mode: "onTouched",
  });

  const [categoriesOptions, setCategoriesOptions] = useState<JSX.Element[]>([]);

  useEffect(() => {
    //TODO: get categories from db
    const inputArray = [
      "personal finance",
      "health and workplace safety",
      "sewing",
      "electronics",
    ];
    setCategoriesOptions(
      inputArray.map((categoryENG: string, key: number) => (
        <option value={categoryENG} key={key}>
          {categories[inputArray[key]]?.br}
        </option>
      ))
    );
  }, []);

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
              <Checkbox isChecked={true} isActive={true} />
              <p className="text-greyscale-text-body">{t("createCourse.generalInfo")}</p>
            </div>
            <div className="flex gap-x-3 items-center">
              <Checkbox isChecked={false} isActive={false} />
              <p className="text-greyscale-text-body">{t("createCourse.createSections")}</p>
            </div>
            <div className="flex gap-x-3 items-center pb-16 border-b border-greyscale-border-lighter">
              <Checkbox isChecked={false} isActive={false} />
              <p className="text-greyscale-text-body">{t("createCourse.generalInfo")}</p>
            </div>
          </div>
        </div>

        {/*------------ Right side ------------*/}
        <div className="w-full">
          <h1 className="font-bold text-3xl text-greyscale-text-title">{t("createCourse.generalInfo")}</h1>
          <Form {...form}>
            <div className="flex flex-col gap-y-5 mt-5 rounded-xl p-6 shadow-lg">
              <FormInput
                control={form.control}
                fieldName="title"
                inputSize="md"
                label={t('courseManager.courseName')}
                placeholder={t('courseManager.courseNamePlaceholder')}
                type="text"
                isRequired
              />

              <div className="flex items-center gap-8 w-full">
                {/*Field to select a level from a list of options*/}
                <div className="flex flex-col w-1/2 space-y-2 text-left ">
                  <FormSelect
                    control={form.control}
                    inputSize="md"
                    isRequired
                    fieldName="difficulty"
                    label={t('courseManager.level')}
                    placeholder={t('courseManager.selectLevel')}
                    options={[
                      { label: "Iniciante", value: "1" },
                      { label: "Intermediário", value: "2" },
                      { label: "Avançado", value: "3" },
                    ]}
                  />
                </div>

                {/*Field to choose a category from a list of options*/}
                <div className="flex flex-col w-1/2 space-y-2 text-left  ">
                  <FormSelect
                    control={form.control}
                    isRequired
                    inputSize="md"
                    fieldName="category"
                    label={t('courseManager.category')}
                    placeholder={t('courseManager.selectCategory')}
                    options={categoriesOptions.map((option) => ({
                      label: option.props.children,
                      value: option.props.value,
                    }))}
                  />
                </div>
              </div>

              {/*Field to input the description of the course*/}
              <div>
                <FormTextarea
                  control={form.control}
                  fieldName="description"
                  inputSize="sm"
                  label={t('courseManager.description')}
                  placeholder={t('courseManager.descriptionPlaceholder')}
                  maxLength={400}
                  rows={4}
                  isRequired
                  className="resize-none"
                />
                <div className="text-right text-sm mt-1 text-greyscale-text-caption">
                  {form.watch("description")?.length || 0} / 400 {t('courseManager.characters')}
                </div>
              </div>

              <div>
                {/*Cover image field*/}
                <div className="flex flex-col space-y-2 text-left">
                  <label htmlFor="cover-image">
                    {t('courseManager.coverImage')} <span className="text-red-500">*</span>
                  </label>{" "}
                  {/** Cover image */}
                </div>
                <Dropzone
                  inputType="image"
                  id="0"
                  previewFile={null}
                  onFileChange={() => { }}
                  maxSize={5 * 1024 * 1024 /* 5mb */}
                />
              </div>

              {/*Create and cancel buttons*/}
              <div className="modal-action pb-10">
                <div className="whitespace-nowrap flex items-center justify-between w-full mt-8">
                  <Link
                    to="/courses"
                    className="cursor-pointer underline text-error-surface-default py-2 pr-4 bg-transparent hover:bg-warning-100 text-warning w-full transition ease-in duration-200 text-lg font-semibold focus:outline-hidden focus:ring-2 focus:ring-offset-2  rounded-sm"
                  >
                    {t('courseManager.cancelAndReturn')}
                  </Link>
                  <Button
                    className="font-bold px-6"
                  >
                    {t('courseManager.createSections')}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCourse;
