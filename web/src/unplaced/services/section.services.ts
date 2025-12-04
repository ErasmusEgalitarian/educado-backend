import axios from "axios";

// Intefaces

import { BACKEND_URL } from "../../shared/config/environment";

/**
 * Get section information
 * @param sid section id of the section you want details about
 * @param token token of the user
 * @returns response data from the backend get request
 */

export const getSectionDetail = (sid: string, token: string) => {
  if (sid == undefined) {
    throw "Error: getSectionDetail input sid is undefined";
  }
  return axios
    .get(`${BACKEND_URL}/api/sections/${sid}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};

/**
 * Update a section with new data
 */
export const saveSection = async (
  data: any,
  id: string | undefined,
  token: string,
) => {
  if (id == undefined) {
    throw "Error: saveSection input id is undefined";
  }
  // Send the info to caller
  return axios.patch(`${BACKEND_URL}/api/sections/${id}`, data, {
    headers: { authorization: `Bearer ${token}` },
  });
};

/**
 * Create a new section for a course
 *
 * @param data Input data, should be a Section interface
 * @param id id of the section
 * @param token token of the user, currently ignored
 * @returns respons from the backend post request
 */
const createSection = async (
  data: any,
  id: string | undefined,
  token: string,
) => {
  if (id == undefined) {
    throw "Error: createSection input id is undefined";
  }
  return await axios.put(`${BACKEND_URL}/api/sections/${id}`, data, {
    headers: { authorization: `Bearer ${token}` },
  });
};

/**
 * Delete a section
 *
 * @param id Section ID
 * @param token
 * @returns
 */
const deleteSection = async (id: string | undefined, token: string) => {
  if (id == undefined) {
    throw "Error: deleteSection input id is undefined";
  }
  return await axios.delete(`${BACKEND_URL}/api/sections/${id}`, {
    headers: { authorization: `Bearer ${token}` },
  });
};

const SectionServices = Object.freeze({
  getSectionDetail,
  saveSection,
  createSection,
  deleteSection,
});

export default SectionServices;
