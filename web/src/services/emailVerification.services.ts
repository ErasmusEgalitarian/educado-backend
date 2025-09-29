import axios from "axios";

import { BACKEND_URL } from "../helpers/environment";

const client = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const sendEmail = async (email: string) => {
  try {
    const res = await client.post("/api/auth/signup", {
      email: email,
    });
    return res;
  } catch (err : any) {
    if (err.response?.data != null) {
      throw err.response.data;
    }
    throw err;
  }
  
}

const verifyCode = async (email: string, token: string) => {
  try {
    const res = await client.post("/api/auth/verify-email", {
      email: email,
      token: token,
    });
    return res;
  } catch (err : any) {
    console.error(err);
    if (err.response?.data != null) {
      throw err.response.data;
    }
    throw err;
  }
}



export { sendEmail, verifyCode };