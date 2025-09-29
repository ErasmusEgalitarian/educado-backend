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
    const res = await client.post("/api/auth/reset-password-request", {
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
    const res = await client.post("/api/auth/reset-password-code", {
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

const updatePassword = async (email: string, password: string, token: string) => {
  return await client.patch("/api/auth/reset-password", {
    email: email,
    newPassword: password,
    token: token,
  });
}

export { sendEmail, verifyCode, updatePassword };