import axios from "axios";

import { Institution } from "@/user/types/institution.ts";
import { BACKEND_URL } from "../../shared/config/environment";

const getInstitutions = async (token: string) => {
  const res = await axios.get<Institution[]>(
    `${BACKEND_URL}/api/institutions`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

const getSingleInstitution = async (id: string, token: string) => {
  return await axios.get<Institution>(`${BACKEND_URL}/api/institutions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const createInstitution = async (token: string, data: Institution) => {
  return await axios.post(
    `${BACKEND_URL}/api/institutions/`,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

const updateInstitution = async (
  id: string,
  token: string,
  data: Institution,
) => {
  const res = await axios.patch<{ message: string; institution: Institution }>(
    `${BACKEND_URL}/api/institutions/${id}`,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

const deleteInstitution = async (id: string, token: string) => {
  const res = await axios.delete<Institution>(
    `${BACKEND_URL}/api/institutions/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

export const institutionService = {
  getInstitutions,
  getSingleInstitution,
  createInstitution,
  updateInstitution,
  deleteInstitution,
};
