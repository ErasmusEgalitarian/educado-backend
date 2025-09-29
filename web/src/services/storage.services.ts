import axios from "axios";

// Backend URL from .env file (automatically injected) 
import { BACKEND_URL } from "../helpers/environment";


//import { Storage } from '@google-cloud/storage';


export interface StorageInterface {
  uploadFile: (bucketName: string, file: any, id: string) => void;
  downloadFile: (bucketName: string, id: string, file: any) => void;
}

// Props interface for uploadFile function
type FileProps = {
  file: any,
  id: string | undefined,
  parentType: string
}
/**
 * Uploads a file to a bucket
 * @param {string} file - The local path to the file to upload 
 * @param {string} id - The id the file will be saved as in the bucket. Format: courseId/sectionsId/componentId/index or courseId/index
 * @param {string} parentType - A single letter that represents the type of the parent component. Format: c for course, and  l for lecture
 * @param {string} parentType - A single letter that represents the type of the parent component. Format: c for course, and  l for lecture
 * @returns {void}
*/
async function uploadFile({ id, file, parentType: parentType }: FileProps) {

  if (!file || !id) {
    return;
  }
  axios.postForm(`${BACKEND_URL}/api/bucket`, {
    fileName: id + "_" + parentType,
    file: file
  })
}

const getMedia = async (fileName: string, retries = 10, delay = 2000): Promise<string> => {
  for (let attempt = 1; attempt <= retries; attempt++) { //TODO: This function should try to fetch multiple times, but instead when the media in question, has been uploaded
    try {
      const res = await axios.get(`${BACKEND_URL}/api/bucket/${fileName}`);
      const file = res.data;
      const mimeType = res.headers['content-type'];
      const dataUrl = `data:${mimeType};base64,${file}`;
      return dataUrl;
    } catch (error) {
      if (attempt < retries) {
        console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('All retry attempts failed');
        throw error;
      }
    }
  }
  return "";
};

const deleteFile = async (id: string | undefined, token: string) => {
  if (!id) {
    return;
  }
  return await axios.delete(`${BACKEND_URL}/api/bucket/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);
};

const StorageServices = Object.freeze({
  uploadFile,
  getMedia,
  deleteFile
});

export default StorageServices;