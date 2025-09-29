import axios from "axios";

import { ContentCreator } from "@/user/types/ContentCreator";
import { User } from "@/user/types/User";

import { BACKEND_URL } from "../../shared/config/environment";

const deleteUser = async (id: string, token: string) => {
  const res = await axios.delete(`${BACKEND_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getSingleUserDetails = async (id: string, token: string) => {
  const res = await axios.get<User>(`${BACKEND_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getUserApplications = async (token: string) => {
  const res = await axios.get<{ data: (User & ContentCreator)[] }>(
    `${BACKEND_URL}/api/user-info`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data.data;
};

const changeUserRole = async (id: string, token: string, newRole: string) => {
  const res = await axios.patch(
    `${BACKEND_URL}/api/users/${id}/role`,
    { newRole },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
};

const getContentCreator = async (id: string, token: string) => {
  const res = await axios.get<ContentCreator>(
    `${BACKEND_URL}/api/user-info/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

const AdminServices = {
  deleteUser,
  getSingleUserDetails,
  getUserApplications,
  changeUserRole,
  getContentCreator,
};

export default AdminServices;
