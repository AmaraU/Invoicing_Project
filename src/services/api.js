import axios from "axios";
import { handleErrors } from "../utils/handleResponse";

const createAxiosClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 50000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log(error)
      if (error.response?.status === 400) {
        if (error.response.data.ResponseCode === "04") {
          handleErrors({ message: "Access Denied" });
          throw error;
        }

        if (error.response.data.ResponseCode === "08") {
          sessionStorage.removeItem("authToken");
          sessionStorage.clear();
          handleErrors({ message: "Session Expired" });
          window.location.href = "/signin";
        }
      }
      if (error.response?.status === 401) {
        console.log('here')
        sessionStorage.removeItem("authToken");
        sessionStorage.clear();
        handleErrors({ message: "Session Expired" });
        window.location.href = "/signin";
      }
      if (error.response?.status === 500) {
        handleErrors(error.response?.data.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}


export default createAxiosClient;
