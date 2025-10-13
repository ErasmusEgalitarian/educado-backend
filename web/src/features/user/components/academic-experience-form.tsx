import { mdiDelete, mdiPlus } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { Fragment } from "react";

export default function AcademicExperienceForm({
  index,
  educationFormData,
  handleEducationInputChange,
  educationErrors,
  addNewEducationForm,
  handleEducationDelete,
}: Readonly<{
  index: number;
  educationFormData: {
    educationLevel: string;
    status: string;
    course: string;
    institution: string;
    educationStartDate: string;
    educationEndDate: string;
    _id: string | number | null;
  }[];
  handleEducationInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => void;
  educationErrors: Record<
    number,
    {
      educationStartDate: string;
      educationEndDate: string;
      [key: string]: string | undefined;
    }
  >;
  addNewEducationForm: (index: number) => void;
  handleEducationDelete: (index: number, id: string | null) => void;
  errors: unknown;
}>) {
  function displayInvalidDateFormatErrMsg(strValue: string, errorMsg: string) {
    if (strValue !== "") {
      return (
        <p
          className="flex items-center mt-1 ml-3 text-warning text-sm"
          role="alert"
        >
          {errorMsg}
        </p>
      );
    }
    return null;
  }

  function displayLabelAndAsterisk(labelName: string) {
    return (
      <label>
        {labelName}
        <span className="p-2 text-warning text-sm">*</span>
      </label>
    );
  }

  return (
    <Fragment>
      <div
        key={index}
        /* Apply rounded bottom corners if this is the only form or the last in the bottom */
        className={`border border-primary p-4 text-left bg-white shadow-xl font-['Montserrat'] ${
          (educationFormData?.length === 1 && index === 0) ||
          (educationFormData?.length > 1 &&
            index === educationFormData?.length - 1)
            ? "rounded-b-lg"
            : ""
        }`}
      >
        {/* Form number */}
        <label className="text-grayMedium font-bold">
          Experiências acadêmicas {index + 1}
        </label>

        {/* Education level and status div */}
        <div className="grid grid-cols-2 gap-3 mb-4 mt-4">
          {/* Education level */}
          <div className="flex flex-col ">
            {displayLabelAndAsterisk("Formação")}

            {/* Drop-down */}
            <select
              className="bg-secondary rounded-lg border-none"
              id={`educationLevel-${index}`}
              name="educationLevel"
              value={educationFormData[index]?.educationLevel || ""}
              required={true}
              onChange={(value) => {
                handleEducationInputChange(value, index);
              }}
            >
              <option value="" disabled hidden>
                Formação
              </option>
              <option value="Basic">Básico</option>
              <option value="Medium">Médio</option>
              <option value="Superior">Superior</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col ">
            {displayLabelAndAsterisk("Status")}

            {/* Drop-down */}
            <select
              className="bg-secondary rounded-lg border-none"
              id={`status-${index}`}
              name="status"
              value={educationFormData[index]?.status || ""}
              required={true}
              onChange={(value) => {
                handleEducationInputChange(value, index);
              }}
            >
              <option value="" disabled hidden>
                Status
              </option>
              <option value="Progressing">Em andamento</option>
              <option value="Done">Concluída</option>
              <option value="Not Done">Não finalizado</option>
            </select>
          </div>
        </div>

        {/* Course and institution div */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Course */}
          <div className="flex flex-col ">
            {displayLabelAndAsterisk("Curso")}

            <input
              className="bg-secondary rounded-lg border-none"
              id={`course-${index}`}
              placeholder="Curso"
              type="text"
              name="course"
              value={educationFormData[index]?.course || ""}
              required={true}
              onChange={(value) => {
                handleEducationInputChange(value, index);
              }}
            />
          </div>

          {/* Institution */}
          <div className="flex flex-col ">
            {displayLabelAndAsterisk("Instituição")}

            <input
              className="bg-secondary rounded-lg border-none"
              id={`institution-${index}`}
              placeholder="Instituição"
              type="text"
              name="institution"
              value={educationFormData[index]?.institution || ""}
              required={true}
              onChange={(value) => {
                handleEducationInputChange(value, index);
              }}
            />
          </div>
        </div>

        {/* Education start and end date div */}
        <div className="grid grid-cols-2 gap-3">
          {/* Education start date */}
          <div className="flex flex-col ">
            {displayLabelAndAsterisk("Início")}

            <input
              className="bg-secondary rounded-lg border-none"
              id={`educationStartDate-${index}`}
              placeholder="Mês/Ano"
              type="text"
              maxLength={7}
              name="educationStartDate"
              value={educationFormData[index]?.educationStartDate || ""}
              required={true}
              onChange={(value) => {
                handleEducationInputChange(value, index);
              }}
            />

            {/* Display invalid date input error message */}
            {displayInvalidDateFormatErrMsg(
              educationFormData[index]?.educationStartDate,
              educationErrors[index].educationStartDate,
            )}
          </div>

          {/* Education end date */}
          <div className="flex flex-col ">
            {displayLabelAndAsterisk("Fim")}

            <input
              className="bg-secondary rounded-lg border-none"
              id={`educationEndDate-${index}`}
              placeholder="Mês/Ano"
              type="text"
              maxLength={7}
              name="educationEndDate"
              value={educationFormData[index]?.educationEndDate || ""}
              required={true}
              onChange={(value) => {
                handleEducationInputChange(value, index);
              }}
            />

            {/* Display invalid date input error message */}
            {displayInvalidDateFormatErrMsg(
              educationFormData[index]?.educationEndDate,
              educationErrors[index].educationEndDate,
            )}
          </div>
        </div>

        {/* Delete form button */}
        {/* Displayed on all forms except the first one */}
        {index > 0 && (
          <div className="flex justify-end gap-1">
            {/* Trash can icon */}
            <Icon path={mdiDelete} size={0.8} className="mt-3.5 text-warning" />

            <button
              type="button"
              className="text-warning font-bold py-3"
              onClick={() => {
                handleEducationDelete(
                  index,
                  educationFormData[index]?._id?.toString() || "",
                );
              }}
            >
              Remover formação
            </button>
          </div>
        )}

        {/* Form separation border line */}
        {/* Only visible on last form, otherwise create distance */}
        <div
          className={
            index === educationFormData?.length - 1
              ? "border-t border-grayMedium py-2 mt-4"
              : "py-30 mt-5"
          }
        />

        {/* Add another form button */}
        {/* Only visible on last created form */}
        {index === educationFormData?.length - 1 && (
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="education_add_button w-full px-4 py-2 rounded-lg border-dashed border-2 border-grayMedium text-grayDark flex items-center justify-center gap-2"
              onClick={() => {
                addNewEducationForm(index);
              }}
            >
              {/* + icon in front of button text */}
              <Icon path={mdiPlus} size={0.9} className="text-grayMedium" />
              Adicionar outra experiência
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
}
