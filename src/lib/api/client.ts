import axios from "axios";

export const nasaClient = axios.create({
  baseURL: "https://api.nasa.gov",
  timeout: 30000,
  params: {
    api_key: process.env.NEXT_PUBLIC_NASA_API_KEY,
  },
});

nasaClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.error("NASA API rate limit exceeded");
    } else if (error.response?.status === 403) {
      console.error("Invalid NASA API key");
    }
    return Promise.reject(error);
  }
);

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
