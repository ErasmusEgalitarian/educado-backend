import axios from "axios";

import { BACKEND_URL } from "@/shared/config/environment";
import { Application } from "@/user/types/Application";
import { Institution } from "@/user/types/Institution";
import { User } from "@/user/types/User";

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  motivation: string;

  jobs: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;

  educations: Array<{
    educationType: string;
    isInProgress: string;
    course: string;
    institution: string;
    startDate: string;
    endDate: string;
  }>;
}



const postUserSignup = async (formData: ContentCreatorApplication) => {
  return await axios.post(`${BACKEND_URL}/api/auth/signup`, formData);
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
