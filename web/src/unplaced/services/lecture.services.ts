import axios from "axios";

// Interfaces
import { BACKEND_URL } from "../../shared/config/environment";

// Interface for posting lecture content
export interface LectureInterface {
  title: string;
  description: string;
  contentType: string;
  content: string;
}

/**
 * Add a new lecture
 *
 * @param title Title of the lecture
 * @param description Description of the lecture
 * @param token Token of the user
 * @param sid section ID
 * @returns A complition message
 */

const addLecture = async (
  { title, description, contentType, content }: LectureInterface,
  token: string,
  sid: string,
) => {
  return await axios.put(
    `${BACKEND_URL}/api/lectures/${sid}`,
    {
      title: title,
      description: description,
      contentType: contentType,
      content: content,
    },
    { headers: { authorization: `Bearer ${token}` } },
  );
};

/**
 * Update a lecture
 *
 * @param props The lecture object
 * @param token Token of the user
 * @param lid Lecture ID
 * @returns A complition message
 */
const updateLecture = async (props: any, token: string, lid: string) => {
  if (lid == undefined) {
    throw "Error: updateLecture input id is undefined";
  }

  const response = await axios.patch(
    `${BACKEND_URL}/api/lectures/${lid}`,
    props,
    { headers: { authorization: `Bearer ${token}` } },
  );
  return response.data;
};

/**
 * Get a lecture detail
 *
 * @param url The route to get the lecture details
 * @param token Token of the user
 * @returns A list of lectures
 */
const getLectureDetail = (url: string, token: string) => {
  return axios
    .get(url, { headers: { authorization: `Bearer ${token}` } })
    .then((res) => res.data);
};

/**
 * Get lectures by section ID
 *
 * @param sid Section ID
 * @param token Token of the user
 * @returns A list of lectures
 */
const getLectureBySectionId = (sid: string, token: string) => {
  return axios
    .get(`${BACKEND_URL}/api/lectures/section/${sid}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};

/**
 * Delete a lecture
 *
 * @param lid Lecture ID
 * @param token
 * @returns A complition message
 */
const deleteLecture = async (lid: string | undefined, token: string) => {
  if (lid == undefined) {
    throw "Error: deleteLecture input id is undefined";
  }
  return await axios.delete(`${BACKEND_URL}/api/lectures/${lid}`, {
    headers: { authorization: `Bearer ${token}` },
  });
};

const LectureService = Object.freeze({
  addLecture,
  updateLecture,
  getLectureDetail,
  getLectureBySectionId,
  deleteLecture,
});

export default LectureService;
