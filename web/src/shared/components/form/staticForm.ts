import { useState } from "react";

import { getUserInfo } from "@/auth/lib/userInfo";
import { useFormData } from "@/shared/lib/formStates";

import ProfileServices from "../../../unplaced/services/profile.services";

export default () => {
  //Form States & localstorage
  const { formData, setFormData } = useFormData();
  const userInfo: any = getUserInfo();

  //asign userID
  let id: string;
  userInfo.id ? (id = userInfo.id) : (id = "id");
  const [userID] = useState(id);

  //Fetch static data
  const fetchStaticData = async () => {
    const response = await ProfileServices.getUserFormOne(userID);
    const data = response.data;
    setFormData((prevData) => ({
      ...prevData,
      UserName: data.userName,
      UserEmail: data.userEmail,
      bio: data.userBio,
      linkedin: data.userLinkedInLink,
      photo: data.userPhoto,
    }));
  };

  //Handle for Profile Image
  const handleFileChange = async (event: any) => {
    const formData = new FormData();
    formData.append("file", event.target.files?.[0]);
    formData.append("fileName", event.target.files?.[0].name);

    const response = await ProfileServices.postImage(formData);
    if (response.status == 200) {
      setFormData((prevSTate) => {
        const newState = { ...prevSTate };
        newState.photo = event.target.files[0].name;
        return newState;
      });
    }
  };

  //Handles for static input change from fields, takes name and value and stores in formData.
  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Count characters written in bio
  const handleCharCountBio = () => {
    let text = formData.bio || "";
    text = text.replace(/\s/g, "");
    return text.length;
  };

  // fetch user data name & email
  const fetchuser = async () => {
    const userInfo: any = getUserInfo();

    let firstName;
    userInfo.firstName
      ? (firstName = userInfo.firstName)
      : (firstName = "Firstname");

    let email = "email";
    userInfo.email ? (email = userInfo.email) : (email = "Email");

    //set formData state to name and email given by signup
    if (userInfo) {
      setFormData((prevData) => ({
        ...prevData,
        UserName: userInfo.firstName,
        UserEmail: userInfo.email,
      }));
    }
  };

  return {
    fetchStaticData,
    fetchuser,
    handleInputChange,
    handleFileChange,
    formData,
    setFormData,
    handleCharCountBio,
  };
};
