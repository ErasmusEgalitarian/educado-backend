import axios from "axios";

// Backend URL from enviroment
import { Course, CreatorPopulatedCourse } from "@/course/types/Course";
import { getCourseIdFromFormData } from "@/unplaced/formDataUtils";

import { getUserInfo, getUserToken } from "../../features/auth/lib/userInfo";
import { BACKEND_URL } from "../../shared/config/environment";

// Create a new course
const createCourse = async (newCourse: FormData, token: string) => {
  try {
    const res = await axios.put(
      `${BACKEND_URL}/api/courses/create/new`,
      newCourse,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};
// Update a course
const updateCourse = async (updatedCourse: FormData, token: string) => {
  const courseId = getCourseIdFromFormData(updatedCourse);
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/courses/update/${courseId}`,
      updatedCourse,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

/**
 * IN ALL METHODS THE TOKEN HAS BEEN COMMENTED OUT, SINCE WE DON'T HAVE A TOKEN YET
 */

/**
 * Get all courses from specific creator
 * @param token The token of the user
 * @returns A list of all courses for the creator
 */
const getAllCreatorCourses = async (token: string) => {
  const { id } = getUserInfo();

  const res = await axios.get<Course[]>(
    `${BACKEND_URL}/api/courses/creator/${id}`,
    {
      headers: { Authorization: `Bearer ${token}`, token: token },
    },
  );

  // Convert dates in course data to Date objects
  res.data.forEach((course) => {
    if (course.dateCreated) course.dateCreated = new Date(course.dateCreated);
    if (course.dateUpdated) course.dateUpdated = new Date(course.dateUpdated);
  });

  return res.data;
};

/**
 * Get all courses
 * @returns A list of all courses
 */
const getAllCourses = async () => {
  const token = getUserToken();
  const res = await axios.get<CreatorPopulatedCourse[]>(
    `${BACKEND_URL}/api/courses/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  // Convert dates in course data to Date objects
  res.data.forEach((course) => {
    if (course.dateCreated) course.dateCreated = new Date(course.dateCreated);
    if (course.dateUpdated) course.dateUpdated = new Date(course.dateUpdated);
  });

  return res.data;
};

/**
 * Get course detail
 * @param url The route to get the course detail
 * @returns The course detail
 */

const getCourseDetail = async (id: string, token: string) => {
  const res = await axios.get(`${BACKEND_URL}/api/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

const updateCourseDetail = async (
  data: Partial<Course>,
  id: string | undefined,
  token: string,
) => {
  const res = await axios.patch(`${BACKEND_URL}/api/courses/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// Get course categories - FROM LAST YEAR, NOT IMPLEMENTED, CATEGORIES ARE HARDCODED RN
const getCourseCategories = async (url: string, token: string) => {
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

/**
 * Delete a specific course
 * @param id the id of the course that will be deleted
 * @param token token of the user
 * @returns Delete data
 */
const deleteCourse = async (id: string | undefined, token: string) => {
  return await axios.delete(`${BACKEND_URL}/api/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getCourseFeedback = async (url: string, token: string) => {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

// Export all methods
const CourseServices = Object.freeze({
  createCourse,
  updateCourse,
  getAllCreatorCourses,
  getAllCourses,
  getCourseDetail,
  updateCourseDetail,
  getCourseCategories,
  deleteCourse,
  getCourseFeedback,
});

export default CourseServices;
