import axios from "axios";

const httpClientFastapi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/etl",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});


httpClientFastapi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token-datanova");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClientFastapi;
