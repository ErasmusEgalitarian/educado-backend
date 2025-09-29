import axios from "axios";
import { BACKEND_URL } from "@helpers/environment";
import { Institution } from "@interfaces/Institution";
import { Application } from "@interfaces/Application";
import { User } from "@interfaces/User";

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

const postUserLogin = async (credentials: UserCredentials) => {
  return await axios.post(`${BACKEND_URL}/api/auth/login`, credentials);
};

const postUserSignup = async (formData: ContentCreatorApplication) => {
  return await axios.post(`${BACKEND_URL}/api/auth/signup`, formData);
};

const postUserVerification = async (formData: ContentCreatorApplication) => {
  return await axios.post(`${BACKEND_URL}/api/auth/verify-email`, formData);
};

const GetCCApplications = async () => {
  return await axios.get(`${BACKEND_URL}/api/applications`);
};

const GetSingleCCApplication = async (id: string | undefined) => {
  return await axios.get<{ applicator: User; application: Application }>(
    `${BACKEND_URL}/api/applications/${id}`
  );
};

const AcceptApplication = async (id: string): Promise<unknown> => {
  return await axios.put(`${BACKEND_URL}/api/applications/${id}approve`);
};

const RejectApplication = async (
  id: string,
  rejectionReason: string
): Promise<unknown> => {
  return await axios.put(`${BACKEND_URL}/api/applications/${id}reject`, {
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
  return await axios.post(
    `${BACKEND_URL}/api/applications/newapplication`,
    data
  );
};

const addInstitution = async (data: Institution) => {
  const res = await axios.post<Institution>(
    `${BACKEND_URL}/api/applications/newinstitution`,
    data
  );
  return res.data;
};

const AuthServices = Object.freeze({
  postUserLogin,
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
