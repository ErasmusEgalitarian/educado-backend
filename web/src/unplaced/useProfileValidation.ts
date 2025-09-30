import { useEducationErrors, useExperienceErrors } from "@/shared/lib/formStates";


/**
 * Custom hook for validating education and experience forms on /profile and /application endpoints.
 * Ensures that date inputs follow correct format, and updates error states accordingly.
 *
 * @returns {Object} - An object containing the validation handler and error states for education and experience forms.
 */
export default () => {
  // Education and experience error states
  const {
    educationErrors,
    setEducationErrors,
    educationErrorState,
    setEducationErrorState,
  } = useEducationErrors();
  const {
    experienceErrors,
    setExperienceErrors,
    experienceErrorState,
    setExperienceErrorState,
  } = useExperienceErrors();

  // Ensure a correct MM/YYYY format
  const dateValidation = (value: string): boolean => {
    const [month, year] = value.split("/");
    return (
      /^\d{2}\/\d{4}$/.test(value) && // Regex pattern: MM/YYYY
      parseInt(month) >= 1 &&
      parseInt(month) <= 12 &&
      year !== "0000"
    );
  };

  // Validation of input fields on education/experience forms and updating of error states accordingly
  const handleValidation = (
    index: number,
    name: string,
    value: string,
    formType: "education" | "experience",
    isCurrentJob = false,
  ) => {
    const invalidDateFormatErrMsgStr = "Formato inválido! Utilize: MM/AAAA";
    const isInputFieldEmpty = value === "";
    const ignoreDescription = name === "description";
    const ignoreEmptyWorkEndDate = name === "workEndDate" && isCurrentJob;
    const isDateValid = dateValidation(value);

    // Determine which state to update based on form type
    const setErrorState =
      formType === "education"
        ? setEducationErrorState
        : setExperienceErrorState;
    const setErrors =
      formType === "education" ? setEducationErrors : setExperienceErrors;

    // Set the error state to true if the date format is invalid or the input field is empty,
    // but ignore if the input field is the description or the workEndDate is empty and isCurrentJob is true
    if (ignoreDescription || ignoreEmptyWorkEndDate) setErrorState(false);
    else setErrorState(isInputFieldEmpty || !isDateValid);

    // Update the error message for the specified input field
    setErrors((prevState: any) => {
      const newState = [...prevState];

      // Clear error if date input field is empty or valid
      newState[index][name] =
        !isDateValid || isInputFieldEmpty ? invalidDateFormatErrMsgStr : "";

      return newState;
    });
  };

  // Return states and validation function
  return {
    handleValidation,
    experienceErrors,
    setExperienceErrors,
    educationErrorState,
    setEducationErrorState,
    educationErrors,
    setEducationErrors,
    experienceErrorState,
    setExperienceErrorState,
  };
};
