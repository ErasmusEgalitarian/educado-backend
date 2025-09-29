import axios from "axios";

// Interfaces
import { BACKEND_URL } from "../helpers/environment";

const getComponentDetail = (cid: string, type: string, token: string) => {
  return axios
    .get(`${BACKEND_URL}/api/components/${type}/${cid}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};

const setComponents = (sid: string, data: any[]) => {
  return axios.patch(`${BACKEND_URL}/api/components/${sid}`, {
    components: data,
  });
};

const ComponentService = Object.freeze({ getComponentDetail, setComponents });

export default ComponentService;
