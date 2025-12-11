import axios from "axios";

import { BACKEND_URL } from "@/shared/config/environment";
import { Application } from "@/user/types/application.ts";
import { Institution } from "@/user/types/institution.ts";
import { User } from "@/user/types/User";
import { getUserToken } from "@/auth/lib/userInfo";

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

const postUserSignup = async (formData: ContentCreatorApplication) => {
  return await axios.post(`${BACKEND_URL}/api/auth/signup`, formData);
};

const postUserVerification = async (formData: ContentCreatorApplication) => {
  return await axios.post(`${BACKEND_URL}/api/auth/verify-email`, formData);
};

const GetCCApplications = async () => {
    const token = getUserToken();
  return await axios.get(`${BACKEND_URL}/api/user-info`,{
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );
};

const GetSingleCCApplication = async (id: string | undefined) => {
    const token = getUserToken();

  return await axios.get<{ applicator: User; application: Application }>(
    `${BACKEND_URL}/api/user-info/${id}`,
      {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      },
  );
};

const AcceptApplication = async (id: string): Promise<unknown> => {
    return axios.patch(`${BACKEND_URL}/api/content-creators/${id}/status`, {
        statusValue: "APPROVED",
    });
};

    const RejectApplication = async (id: string, rejectionReason: string) => {
        return axios.patch(`${BACKEND_URL}/api/content-creators/${id}/status`, {
            statusValue: "REJECTED",
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
            data,
        );
    };

    const addInstitution = async (data: Institution) => {
        const res = await axios.post<Institution>(
            `${BACKEND_URL}/api/applications/newinstitution`,
            data,
        );
        return res.data;
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
