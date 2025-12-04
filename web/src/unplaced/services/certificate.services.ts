import axios from "axios";

// Backend URL from enviroment
import { CertificateIds } from "@/certificates/types/Certificate";

import { getUserToken } from "../../features/auth/lib/userInfo";
import { CERT_URL } from "../../shared/config/environment";

// Interface for posting course content
export interface CourseInterface {
  creatorId: string;
  courseId: string;
}

const client = axios.create({
  baseURL: CERT_URL,
  headers: {
    "Content-Type": "application/json",
    token: getUserToken(),
  },
});

const createCertificate = async (certificate: CertificateIds) => {
  return await client.put(
    `/api/creator-certificates`,
    {
      creatorId: certificate.creatorId,
      courseId: certificate.courseId,
    },
    {
      headers: {
        authorization: `Bearer ${getUserToken()}`,
        token: getUserToken(),
      },
    },
  );
};

const getUserCertificates = async (id: string) => {
  const certificates = await client.get(
    "/api/creator-certificates/creator/" + id,
    {
      headers: {
        token: getUserToken(),
      },
    },
  );

  return certificates.data;
};

const deleteCertificate = async (creatorId: string, courseId: string) => {
  return await axios.delete(`${CERT_URL}/api/creator-certificates`, {
    data: {
      creatorId: creatorId,
      courseId: courseId,
    },
    headers: {
      authorization: `Bearer ${getUserToken()}`,
      token: getUserToken(),
    },
  });
};

// Export all methods
const CertificateService = Object.freeze({
  createCertificate,
  getUserCertificates,
  deleteCertificate,
});

export default CertificateService;
