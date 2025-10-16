import axios from "axios";
const apilocal = import.meta.env.VITE_DB_URL_LOCAL;
const apiRender = import.meta.env.VITE_DB_URL_RENDER;

const axiosClient = axios.create({
  baseURL: apilocal,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE3NjM3NTYzNzQsInN1YiI6ImRldnNvZ2EiLCJpYXQiOjE3NjExNjQzNzR9.8Qk_tBWpJWM_y2MCWAnsP6yOasqBnUABirlhBYKcIbxPoperPLFS9P9IEUU_TQ9_DrKbGrg8wgRjx1z4ZzLcDA"
  }
});

export default axiosClient;
