import { useState } from "react";

import { useEducationFormData, useExperienceFormData, tempObjects } from "@/shared/lib/formStates";

import { getUserInfo } from "../features/auth/lib/userInfo";


import ProfileServices from "./services/profile.services";
import useProfileValidation from "./useProfileValidation";

export default () => {
  //validation
  const {
    handleValidation,
    experienceErrors,
    setExperienceErrors,
    educationErrorState,
    setEducationErrorState,
    educationErrors,
    setEducationErrors,
    experienceErrorState,
    setExperienceErrorState,
  } = useProfileValidation();

  //dynamic form states & localstorage details
  const { educationFormData: educationFormData, setEducationFormData } =
    useEducationFormData();
  const { experienceFormData: experienceFormData, setExperienceFormData } =
    useExperienceFormData();
  const userInfo: any = getUserInfo();

  // assign userID to localstorage ID
  let id: string;
  userInfo.id ? (id = userInfo.id) : (id = "id");
  const [userID] = useState(id);

  // Get default values for empty forms
  const {
    emptyAcademicObject: emptyEducationForm,
    emptyProfessionalObject: emptyWorkForm,
  } = tempObjects();

  // Fetch data for academic and professional experience forms
  const fetchDynamicData = async () => {
    try {
      const [educationFormResponse, workFormResponse] = await Promise.all([
        ProfileServices.getUserFormTwo(userID),
        ProfileServices.getUserFormThree(userID),
      ]);

      // Map backend variables to corresponding frontend variables
      const transformedEducationData =
        educationFormResponse.data.length > 0
          ? educationFormResponse.data.map((item: any) => ({
            ...item,
            educationStartDate: item.startDate,
            educationEndDate: item.endDate,
          }))
          : // Set empty data if forms don't exist in database
          emptyEducationForm;

      // Map backend variables to corresponding frontend variables
      const transformedWorkData =
        workFormResponse.data.length > 0
          ? workFormResponse.data.map((item: any) => ({
            ...item,
            workStartDate: item.startDate,
            workEndDate: item.endDate,
          }))
          : // Set empty data if forms don't exist in database
          emptyWorkForm;

      setEducationFormData(transformedEducationData);
      setExperienceFormData(transformedWorkData);

      setEducationErrors(
        transformedEducationData.map(() => ({
          educationStartDate: "",
          educationEndDate: "",
        })),
      );
      setExperienceErrors(
        transformedWorkData.map(() => ({ workStartDate: "", workEndDate: "" })),
      );
    } catch (error: any) {
      console.error("Error fetching dynamic data: ", error);

      // Handling error in e.g., database access (to avoid crashing page when forms are then expanded)
      setEducationFormData(emptyEducationForm);
      setExperienceFormData(emptyWorkForm);

      setEducationErrors(
        emptyEducationForm.map(() => ({
          educationStartDate: "",
          educationEndDate: "",
        })),
      );
      setExperienceErrors(
        emptyWorkForm.map(() => ({ workStartDate: "", workEndDate: "" })),
      );
    }
  };

  //Handles for dynamic form of Education experience (input, create, delete)
  const handleEducationInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number,
  ) => {
    let { name, value } = event.target;
    if (
      (name == "educationStartDate" || name == "educationEndDate") &&
      value.length > 7
    ) {
      return;
    }
    if (name == "educationStartDate" || name == "educationEndDate") {
      value = value.replace(/[^0-9/]/g, "");
    }

    //Validation
    handleValidation(index, name, value, "education");
    setEducationFormData((prevState) => {
      const newState = [...prevState];
      newState[index] = {
        ...newState[index],
        [name]: value,
      };
      return newState;
    });
  };

  // loops through current input fiels displayed on the UI,and assign them to not being null
  const dynamicInputsFilled = (dynamicForm: any) => {
    if (dynamicForm === "education") {
      const EducationInputsFilled = educationFormData.every(
        (item) =>
          item.educationLevel &&
          String(item.educationLevel).trim() !== "" &&
          item.status &&
          String(item.status).trim() !== "" &&
          item.course &&
          String(item.course).trim() !== "" &&
          item.institution &&
          String(item.institution).trim() !== "" &&
          item.educationStartDate &&
          String(item.educationStartDate).trim() !== "" &&
          item.educationEndDate &&
          String(item.educationEndDate).trim() !== "",
      );
      return EducationInputsFilled;
    } else {
      const ExperienceInputsFilled = experienceFormData.every(
        (item) =>
          item.company &&
          String(item.company).trim() !== "" &&
          item.jobTitle &&
          String(item.jobTitle).trim() !== "" &&
          item.workStartDate &&
          String(item.workStartDate).trim() !== "" &&
          ((item.workEndDate && String(item.workEndDate).trim() !== "") ||
            item.isCurrentJob) && // If isCurrentJob is true, workEndDate can be empty
          item.description &&
          String(item.description).trim() !== "",
      );
      return ExperienceInputsFilled;
    }
  };

  //Display date errors
  const [submitError, setSubmitError] = useState(false);

  const SubmitValidation = () => {
    if (
      !dynamicInputsFilled("education") ||
      !dynamicInputsFilled("experience")
    ) {
      setSubmitError(true);
    } else {
      setSubmitError(false);
    }
  };

  //Creates dynamic block based on conditions
  const addNewEducationForm = async (index: number) => {
    if (!educationErrorState && dynamicInputsFilled("education")) {
      setEducationErrors((prevState) => {
        const newState = [...prevState];
        newState.push({
          educationStartDate: "",
          educationEndDate: "",
        });
        return newState;
      });

      setEducationFormData([
        ...educationFormData,
        {
          status: "",
          institution: "",
          course: "",
          educationLevel: "",
          educationStartDate: "",
          educationEndDate: "",
          _id: null,
        },
      ]);
    }
  };

  //Deletes dynamic form for academdic experience
  const handleEducationDelete = async (index: number, _id: string | null) => {
    //Deletes form.
    if (_id) {
      await ProfileServices.deleteEducationForm(_id);
    }

    const updatedEducationFormation = educationFormData.filter(
      (_, i) => i !== index,
    );
    setEducationFormData(updatedEducationFormation);

    //input date Validation state
    if (
      educationErrors[index].educationStartDate != "" ||
      educationErrors[index].educationEndDate != ""
    ) {
      setEducationErrorState(false);
    }
    setEducationErrors((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  //Handles for dynamic professional expereience form (input, create, delete)
  const addNewExperienceForm = async (index: number) => {
    //Creates new dynamic block based on conditions
    if (!experienceErrorState && dynamicInputsFilled("experience")) {
      setExperienceErrors((prevState) => {
        const newState = [...prevState];
        newState.push({
          workStartDate: "",
          workEndDate: "",
        });
        return newState;
      });

      setExperienceFormData([
        ...experienceFormData,
        {
          company: "",
          jobTitle: "",
          workStartDate: "",
          workEndDate: "",
          isCurrentJob: false,
          description: "",
          _id: null,
        },
      ]);
    }
  };

  // isCurrentJob checkbox handler
  const handleCheckboxChange = (index: number): void => {
    setExperienceFormData((prevState) => {
      const newState = [...prevState];
      newState[index] = {
        ...newState[index],
        isCurrentJob: !newState[index].isCurrentJob,
      };
      return newState;
    });
  };

  //Deletes dynamic form for professional experience
  const handleExperienceDelete = async (index: number, _id: string | null) => {
    //Delete dynamic block
    if (_id) {
      await ProfileServices.deleteExperienceForm(_id);
    }

    const updatedExperienceFormation = experienceFormData.filter(
      (_, i) => i !== index,
    );
    setExperienceFormData(updatedExperienceFormation);

    // If deleted state has validation error then clear state
    if (
      experienceErrors[index].workStartDate != "" ||
      experienceErrors[index].workEndDate != ""
    ) {
      setExperienceErrorState(false);
    }
    setExperienceErrors((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  //Count characters written in professional description
  const handleCountExperience = (index: any) => {
    // if description is not existing then return nothing
    if (
      experienceFormData.length === 0 ||
      typeof experienceFormData[index].description !== "string"
    ) {
      return 0;
    }
    let text = experienceFormData[index].description;
    text = text.replace(/\s/g, "");
    return text.length;
  };

  //handle for dynamic personal experiience form
  const handleExperienceInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    isCurrentJob = false, // Optional parameter with default value
  ): void => {
    let { name, value } = event.target as {
      name: "workStartDate" | "workEndDate";
      value: string;
    };
    if (
      (name == "workStartDate" || name == "workEndDate") &&
      value.length > 7
    ) {
      return;
    }
    if (name == "workStartDate" || name == "workEndDate") {
      value = value.replace(/[^0-9/]/g, "");
    }
    handleValidation(index, name, value, "experience", isCurrentJob);
    setExperienceFormData((prevState) => {
      const newState = [...prevState];
      newState[index] = {
        ...newState[index],
        [name]: value,
      };
      return newState;
    });
  };

  return {
    educationErrorState,
    experienceErrorState,
    experienceErrors,
    educationErrors,
    handleExperienceInputChange,
    handleCountExperience,
    handleCheckboxChange,
    handleExperienceDelete,
    addNewExperienceForm,
    handleEducationDelete,
    addNewEducationForm,
    SubmitValidation,
    submitError,
    handleEducationInputChange,
    fetchDynamicData,
    userID,
    experienceFormData: experienceFormData,
    educationFormData: educationFormData,
    dynamicInputsFilled,
  };
};
