import { useState } from "react";

import { EducationFormData, ExperienceFormData } from "@/user/types/Profile";


// static form states
export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>({
    UserName: "",
    UserEmail: "",
    bio: "",
    linkedin: "",
    photo: "",
  });

  return { formData, setFormData };
};

// dynamic form states - academic
export const useEducationFormData = () => {
  const [educationFormData, setEducationFormData] = useState<
    EducationFormData[]
  >([
    {
      _id: null,
      educationLevel: "",
      status: "",
      course: "",
      institution: "",
      educationStartDate: "",
      educationEndDate: "",
    },
  ]);

  return { educationFormData: educationFormData, setEducationFormData };
};

// dynamic form states - professional
export const useExperienceFormData = () => {
  const [experienceFormData, setExperienceFormData] = useState<
    ExperienceFormData[]
  >([
    {
      _id: null,
      company: "",
      jobTitle: "",
      workStartDate: "",
      workEndDate: "",
      isCurrentJob: false,
      description: "",
    },
  ]);

  return { experienceFormData: experienceFormData, setExperienceFormData };
};

// Error states academic
export const useEducationErrors = () => {
  const [educationErrors, setEducationErrors] = useState([
    {
      educationStartDate: "",
      educationEndDate: "",
    },
  ]);

  const [educationErrorState, setEducationErrorState] = useState(false);
  return {
    educationErrors,
    setEducationErrors,
    educationErrorState,
    setEducationErrorState,
  };
};

export const useExperienceErrors = () => {
  // Error states professionnal
  const [experienceErrors, setExperienceErrors] = useState([
    {
      workStartDate: "",
      workEndDate: "",
    },
  ]);
  const [experienceErrorState, setExperienceErrorState] = useState(false);

  return {
    experienceErrors,
    setExperienceErrors,
    experienceErrorState,
    setExperienceErrorState,
  };
};

export const tempObjects = () => {
  // Create empty object for professional experience
  const emptyAcademicObject = [
    {
      _id: null,
      educationLevel: "",
      status: "",
      course: "",
      institution: "",
      educationStartDate: "",
      educationEndDate: "",
    },
  ];

  // Create empty object for professional experience
  const emptyProfessionalObject = [
    {
      _id: null,
      company: "",
      jobTitle: "",
      workStartDate: "",
      workEndDate: "",
      isCurrentJob: false,
      description: "",
    },
  ];

  return { emptyAcademicObject, emptyProfessionalObject };
};

export const tempData = () => {
  // Create empty object for professional experience
  const [tempProfessionalObject, setTempProfessionalObject] = useState<
    ExperienceFormData[]
  >([
    {
      _id: null,
      company: "",
      jobTitle: "",
      workStartDate: "",
      workEndDate: "",
      isCurrentJob: false,
      description: "",
    },
  ]);

  return { tempProfessionalObject, setTempProfessionalObject };
};
