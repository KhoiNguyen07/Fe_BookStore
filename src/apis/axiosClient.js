import axios from "axios";
const apilocal = import.meta.env.VITE_DB_URL_LOCAL;
const apiRender = import.meta.env.VITE_DB_URL_RENDER;

const axiosClient = axios.create({
  baseURL: "",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;
