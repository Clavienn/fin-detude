import axios from "axios";
// import { getToken } from "@/shared/utils/auth";
import { BASE_URL_API } from "@/lib/api";

const httpClient = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config: any) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token-datanova")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default httpClient;
