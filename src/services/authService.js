import axios from "axios";
import { BaseUrl } from ".";
import { handleErrors } from "../utils/handleResponse";
import createAxiosClient from "./api";


const authApiUrl = createAxiosClient(`${BaseUrl}einvoicingauthapi/api/`);
const clientApiUrl = createAxiosClient(`${BaseUrl}einvoicingclientapi/api/`);


const authService = {

  getToken: async (data) => {
    try {
      const response = await clientApiUrl.post(
        `Client/user/token`, data
      );
      return response?.data;
    } catch (error) {
      handleErrors(error.response.data);
      throw error;
    }
  },

};

export default authService;
