import axios from "axios";

import { BACKEND_URL } from "@/shared/config/environment";
import { Application } from "@/user/types/Application";
import { Institution } from "@/user/types/Institution";
import { User } from "@/user/types/User";

export interface ContentCreatorApplication {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  token: string | null;
}

interface UserCredentials {
  email: string;
  password: string;
  isContentCreator: boolean;
}


export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  //job
  company: string;
  title: string;
  jobstartDate: string;
  jobendDate: string;
  description: string;

  //education
  educationType: string;
  isInProgress: string;
  course: string;
  institution: string;
  edustartDate: string;
  eduendDate: string;
 
  
}



const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {"Content-Type": "application/json",},
});

const postUserLogin = async (credentials: UserCredentials) => {
  return api.post(`/api/auth/login`, credentials);
};

export const postUserSignup = async (payload: SignupPayload) => {
  return await api.post(`/api/content-creator/register`, payload)
  .then(r => r.data);
};

const postUserVerification = async (formData: ContentCreatorApplication) => {
  return await api.post(`/api/auth/verify-email`, formData);
};

const GetCCApplications = async () => {
  return await api.get(`/api/applications`);
};

const GetSingleCCApplication = async (id: string | undefined) => {
  return await api.get<{ applicator: User; application: Application }>(
    `/api/applications/${id}`,
  );
};

const AcceptApplication = async (id: string): Promise<unknown> => {
  return await api.put(`/api/applications/${id}approve`);
};

const RejectApplication = async (
  id: string,
  rejectionReason: string,
): Promise<unknown> => {
  return await api.put(`/api/applications/${id}reject`, {
    rejectionReason,
  });
};

const postNewApplication = async (data: {
  baseUser: string | undefined;
  motivation: string;

  academicLevel: string[];
  academicStatus: string[];
  major: string[];
  institution: string[];
  educationStartDate: string[];
  educationEndDate: string[];

  company: string[];
  position: string[];
  workStartDate: string[];
  workEndDate: string[];
  isCurrentJob: boolean[];
  workActivities: string[];
}) => {
  return await api.post(`/api/applications/newapplication`, data,);
};

  const addInstitution = async (data: Institution) => {
    return await api.post<Institution>(`/api/applications/newinstitution`, data);
  };
  
const AuthServices = Object.freeze({
  postUserSignup,
  GetCCApplications,
  GetSingleCCApplication,
  AcceptApplication,
  RejectApplication,
  postNewApplication,
  addInstitution,
  postUserVerification,
});

export default AuthServices;
