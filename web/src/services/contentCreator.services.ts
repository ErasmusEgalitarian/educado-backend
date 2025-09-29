import axios from "axios";

import { BACKEND_URL } from "../helpers/environment";

export const getAverageRatingOfCC = async (
  userid: string,
  period?: string,
): Promise<number> => {
  try {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/api/rating/getOverallRatingOfCC/?userid=${userid}${period ? `&period=${period}` : ""}`,
      headers: {},
    };
    const response = await axios.request(config);
    return response.data.averageRating;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getAverageRatingOfCourse = async (
  courseid?: string,
): Promise<number> => {
  try {
    if (!courseid) {
      throw new Error("Course ID is required");
    }
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/api/rating/getOverallRatingOfCourse/${courseid}`,
      headers: {},
    };
    const response = await axios.request(config);
    return response.data.averageRating;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getTotalGrantedCertificates = async (
  userid: string,
): Promise<number> => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/api/certificates/getTotalGrantedCertificates/${userid}`,
    };

    const response = await axios.request(config);
    return response.data.totalCertificates;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
