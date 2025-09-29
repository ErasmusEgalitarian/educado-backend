import axios from "axios";

// Backend URL from enviroment
import { CERT_URL } from "../helpers/environment";
import { getUserToken } from "../helpers/userInfo";
import { CertificateIds } from "../interfaces/Certificate";

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
        Authorization: `Bearer ${getUserToken()}`,
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
      Authorization: `Bearer ${getUserToken()}`,
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
