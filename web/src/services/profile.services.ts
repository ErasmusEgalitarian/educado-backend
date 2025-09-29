//imports
import axios from "axios";
import { BACKEND_URL } from '../helpers/environment';


//Upload image request
const postImage = async (formData: any) => {
  return await axios.post(
      `${BACKEND_URL}/api/bucket/`,
      formData
    );
}

//---Get requests---//
// Send get request to personal information form
const getUserFormOne = async (userID: any) => {
  return await axios.get(
    `${BACKEND_URL}/api/profiles/${userID}`
  );
}

// Send get request to academic experience form
const getUserFormTwo = async (userID: any) => {
  return await axios.get(
    `${BACKEND_URL}/api/profiles/educations/${userID}`
  );
}
// Send get request to professional experience form
const getUserFormThree = async (userID: any) => {
  return await axios.get(
    `${BACKEND_URL}/api/profiles/experiences/${userID}`
  );
}

//---Delete requests---//
//Delete additional academic forms 
const deleteEducationForm = async (_id: any) => {
  return await axios.delete(
    `${BACKEND_URL}/api/profiles/educations/${_id}`
  );
}

//Delete additional professional forms
const deleteExperienceForm = async (_id: any) => {
  return await axios.delete(
    `${BACKEND_URL}/api/profiles/experiences/${_id}`
  );
}

//---Update requests---//
// Update personal form
const putFormOne = async (formDataToSend: any) => {
  return await axios.put(
    `${BACKEND_URL}/api/profiles`,
    formDataToSend)
}

// Update academic form
const putFormTwo = async (data: {
    userID: string | undefined;
    educationLevel: string[];
    status: string[];
    course: string[];
    institution: string[];
    startDate: string[];
    endDate: string[];
  }) => {


  return await axios.put(
    `${BACKEND_URL}/api/profiles/educations`, data)
};

// Update professional form
const putFormThree = async (data: {
    userID: string | undefined;
    company: string[];
    jobTitle: string[];
    startDate: string[];
    endDate: string[];
    isCurrentJob: boolean[];
    description: string[];
  }) => {

  return await axios.put(`${BACKEND_URL}/api/profiles/experiences`, data);
};



const ProfileServices = Object.freeze({
  getUserFormThree,
  getUserFormTwo,
  getUserFormOne, 
  deleteExperienceForm,
  deleteEducationForm, 
  putFormThree,
  putFormTwo,
  putFormOne,
  postImage,
});

export default ProfileServices;