// Imports
import { Icon } from "@mdi/react";
import React, { Fragment } from "react";
import { mdiDelete, mdiPlus } from "@mdi/js";

// Export UI content and structure
export default function ProfessionalExperienceForm({
  index,
  experienceFormData,
  handleExperienceInputChange,
  experienceErrors,
  addNewExperienceForm,
  handleExperienceDelete,
  handleCountExperience,
  handleCheckboxChange,
}: {
  index: number;
  experienceFormData: Array<{
    company: string;
    jobTitle: string;
    workStartDate: string;
    workEndDate: string;
    description: string;
    isCurrentJob: boolean;
    _id: string | number | null;
  }>;

  handleExperienceInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    index: number, 
    isCurrentJob?: boolean) => void;

  experienceErrors: { [key: string]: string }[];
  addNewExperienceForm: (index: number) => void;
  handleExperienceDelete: (index: number, id: string) => void;
  handleCountExperience: (index: number) => number;
  handleCheckboxChange: (index: number) => void;
  errors: unknown;
}) {
  
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
  
  function displayLabelAndAsterisk(labelName: string){
    return (
      <label>
        {labelName}
        <span className="p-2 text-warning text-sm">
          *
        </span>
      </label>
    );
  }

  return (
    <Fragment>
      <div key={index}
        /* Apply rounded bottom corners if this is the only form or the last in the bottom */
        className={`border border-primary p-4 text-left bg-white shadow-xl font-['Montserrat'] ${
          (experienceFormData.length === 1 && index === 0) ||
          (experienceFormData.length > 1 && index === experienceFormData.length - 1)
            ? "rounded-b-lg"
            : ""
        }`}
      >
        {/* Form number */}
        <label className="text-grayMedium font-bold">
          Experiências profissionais {index + 1}
        </label>
        
        {/* Company and job title div */}
        <div className="grid grid-cols-2 gap-3 mb-4 mt-4">
          
          {/* Company */}
          <div className="flex flex-col">
            {displayLabelAndAsterisk("Empresa")}
            
            <input
              className="bg-secondary rounded-lg border-none"
              id={`company-${index}`}
              placeholder="Empresa"
              type="text"
              name="company"
              value={experienceFormData[index]?.company || ""}
              required={true}
              onChange={(value) => {
                handleExperienceInputChange(value, index);
              }}
            />
          </div>
            
          {/* Job Title */}
          <div className="flex flex-col">
            {displayLabelAndAsterisk("Cargo")}
            
            <input
              className="bg-secondary rounded-lg border-none"
              id={`jobTitle-${index}`}
              placeholder="Cargo"
              type="text"
              name="jobTitle"
              value={experienceFormData[index]?.jobTitle || ""}
              required={true}
              onChange={(value) => {
                handleExperienceInputChange(value, index);
              }}
            />
          </div>
        </div>

        {/* Work start and end date div */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Work start date */}
          <div className="flex flex-col">
            {displayLabelAndAsterisk("Início")}
            
            <input
              className="bg-secondary rounded-lg border-none"
              id={`workStartDate-${index}`}
              placeholder="Mês/Ano"
              type="text"
              maxLength={7}
              name="workStartDate"
              value={experienceFormData[index]?.workStartDate || ""}
              required={true}
              onChange={(value) => {
                handleExperienceInputChange(value, index);
              }}
            />

            {/* Display invalid date input error message */}
            {displayInvalidDateFormatErrMsg(experienceFormData[index]?.workStartDate, experienceErrors[index].workStartDate)}

          </div>

          {/* Work end date */}
          <div className="flex flex-col">
            {displayLabelAndAsterisk("Fim")}
            
            <input
              className={`bg-secondary rounded-lg border-none ${
                experienceFormData[index]?.isCurrentJob ? 'opacity-60 cursor-not-allowed' : ''}`}
              id={`workEndDate-${index}`}
              placeholder="Mês/Ano"
              type="text"
              maxLength={7}
              name="workEndDate"
              // If isCurrentJob is true, clear the input value
              value={experienceFormData[index]?.isCurrentJob
                  ? ""
                  : experienceFormData[index]?.workEndDate ?? ""
              }
              disabled={experienceFormData[index]?.isCurrentJob || false}
              onChange={(value) => {
                handleExperienceInputChange(value, index, experienceFormData[index]?.isCurrentJob);
              }}
            />

            {/* Display invalid date input error message */}
            {displayInvalidDateFormatErrMsg(experienceFormData[index]?.workEndDate, experienceErrors[index].workEndDate)}

          </div>
        </div>
        
        {/* Current job checkbox */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center col-start-2 gap-2 ml-3">

            <input
              className="border-primary rounded-[2px] cursor-pointer"
              id={`isCurrentJob-${index}`}
              name="isCurrentJob"
              type="checkbox"              
              checked={experienceFormData[index].isCurrentJob}
              onChange={() => {
                handleCheckboxChange(index);
                
                // Clear workEndDate every time the checkbox is toggled
                handleExperienceInputChange({ 
                  target: { name: "workEndDate", value: "" }} as React.ChangeEvent<HTMLInputElement>, 
                  index, 
                  !experienceFormData[index]?.isCurrentJob
                );

              }}
            />

            <label className="cursor-pointer" htmlFor={`isCurrentJob-${index}`}>
              Meu emprego atual
            </label>
          </div>
        </div>

        {/* Work Description */}
        <div className="flex flex-col py-3">
          {displayLabelAndAsterisk("Descrição de atividades")}

          <textarea
            className="h-[120px] bg-secondary rounded-lg border-none resize-none text-lg font-normal"
            id={`description-${index}`}
            placeholder="Escreva aqui as suas responsabilidades"
            maxLength={400}
            name="description"
            value={experienceFormData[index]?.description ?? ""}
            required={true}
            onChange={(value) => {
              handleExperienceInputChange(value, index);
            }}
          />

          <div className="text-right text-sm text-grayDark mt-2">
            {handleCountExperience(index) ?? 0} / 400 caracteres
          </div>
        </div>

        {/* Delete form button */}
        {/* Displayed on all forms except the first one */}
        {index > 0 && (
          <div className="flex justify-end gap-1">
            
            {/* Trash can icon */}
            <Icon
              path={mdiDelete}
              size={0.8}
              className="mt-3.5 text-warning"
            />
            
            <button
              type="button"
              className="text-warning font-bold py-3"
              onClick={() =>
                handleExperienceDelete(index, experienceFormData[index]?._id?.toString() || "")
              }
            >
              Remover formação
            </button>
          </div>
        )}

        {/* Form separation border line */}
        {/* Only visible on last form, otherwise create distance */}
        <div
          className={index === experienceFormData.length - 1
              ? "border-t border-grayMedium py-2 mt-4"
              : "py-30 mt-5"
          }
        />

        {/* Add another form button */}
        {/* Only visible on last created form */}
        {index === experienceFormData.length - 1 && (
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="third_form_add w-full px-4 py-2 rounded-lg border-dashed border-2 border-grayMedium text-grayDark flex items-center justify-center gap-2"
              onClick={() => addNewExperienceForm(index)}
            >
            
            {/* + icon in front of button text */}
            <Icon
              path={mdiPlus}
              size={0.9}
              className="text-grayMedium"
            />
              Adicionar outra experiência
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
}