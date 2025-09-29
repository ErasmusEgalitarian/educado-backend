import axios from "axios";

// Interfaces

import { BACKEND_URL } from "../helpers/environment";

/* Bearer is not implemnted in backend, due to content creators not existing yet */

/**
 * Create a new exercise
 * @param props The exercise object
 * @param token The token of the user
 * @param sid The section ID
 * @returns A completion message
 * */
const addExercise = async (
  props: any,
  token: string,
  sid: string | undefined,
) => {
  if (sid == undefined) {
    throw "Error: addExercise input id is undefined";
  }
  return await axios.put(`${BACKEND_URL}/api/exercises/${sid}`, props, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * Update a exercise
 *
 * @param props The exercise object
 * @param token The token of the user
 * @param eid The exercise ID
 * @returns A completion message
 */
const updateExercise = async (props: any, token: string, eid: string) => {
  if (eid == undefined) {
    throw "Error: updateExercise input id is undefined";
  }
  const response = await axios.patch(
    `${BACKEND_URL}/api/exercises/${eid}`,
    props,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

/**
 * Get all exercise details
 *
 * @param url The route to get the exercise details
 * @param token The token of the user
 * @returns A list of exercises
 */
const getExerciseDetail = (url: string, token: string) => {
  return axios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);
};

/**
 * Get exercises by section ID
 *
 * @param sid Section ID
 * @param token Token of the user
 * @returns A list of exercises
 */
const getExercisesBySectionId = (sid: string, token: string) => {
  return axios
    .get(`${BACKEND_URL}/api/exercises/section/${sid}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};

/**
 * Delete a exercise
 *
 * @param id Exercise ID
 * @param token The token of the user
 * @returns A completion message
 */
const deleteExercise = async (id: string | undefined, token: string) => {
  if (id == undefined) {
    throw "Error: deleteExercise input id is undefined";
  }
  return await axios.delete(`${BACKEND_URL}/api/exercises/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * The exercise services
 */
const ExerciseServices = Object.freeze({
  getExerciseDetail,
  getExercisesBySectionId,
  addExercise,
  updateExercise,
  deleteExercise,
});

export default ExerciseServices;
