import axios from "axios";

import { BACKEND_URL } from "../helpers/environment";

const deleteAccount = async () => {

    const baseUser = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    
    if(baseUser === null)
        throw new Error("No account found in localStorage!");

    if(token === null)
        throw new Error("No token found in localStorage!");

    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/users/${baseUser}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.status;

    } catch (error: any) {
        console.error(error.message);
        if (axios.isAxiosError(error)) 
            console.error("Response Data: ", error.response?.data);
    
        throw error;
    }
}

const getPublicProfileInfo = (profileId: string, token: string | null | undefined) => {
    return axios.get(
        `${BACKEND_URL}/api/public/profiles/${profileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => res.data);
}

const getProfileInfo = (token: string | null | undefined) => {
    return axios.get(
        `${BACKEND_URL}/api/profile/whoami`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => res.data);
}

const updateProfileInfo = (data: any, token: string | null | undefined) => {
    return axios.put(
        `${BACKEND_URL}/api/profile`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => res.data);
}

const changePassword = (data: any, token: string) => {
    return axios.put(
        `${BACKEND_URL}/api/profile/changePassword`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => res.data);
}


const AccountServices = {
    getPublicProfileInfo,
    getProfileInfo,
    updateProfileInfo,
    changePassword,
    deleteAccount
};


export default AccountServices;
