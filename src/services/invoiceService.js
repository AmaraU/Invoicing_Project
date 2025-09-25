import axios from "axios";
import { BaseUrl } from ".";
import { handleErrors } from "../utils/handleResponse";
import createAxiosClient from "./api";


const invoiceApiUrl = createAxiosClient(`${BaseUrl}/einvoicinginvoiceapi/api/`);

const invoiceService = {

  getStatisticsByDate: async (data) => {
    try {

      const {
        FromDateFilter,
        ToDateFilter,
      } = data;

      const params = new URLSearchParams();
      if (FromDateFilter) params.append("FromDateFilter", FromDateFilter);
      if (ToDateFilter) params.append("ToDateFilter", ToDateFilter);
      const query = params.toString();

      const response = await invoiceApiUrl.get(
        `/History/statistics/by-date?${query}`,
      );
      return response?.data;
    } catch (error) {
      handleErrors(error.response.data);
      throw error;
    }
  },

  getStatisticsByCurrency: async (data) => {
    try {
      const {
        FromDateFilter,
        ToDateFilter,
      } = data;

      const params = new URLSearchParams();
      if (FromDateFilter) params.append("FromDateFilter", FromDateFilter);
      if (ToDateFilter) params.append("ToDateFilter", ToDateFilter);
      const query = params.toString();

      const response = await invoiceApiUrl.get(
        `/History/statistics/by-currency?${query}`,
      );
      return response?.data;
    } catch (error) {
      handleErrors(error.response.data);
      throw error;
    }
  },

  getStatisticsByDateByCurrency: async (data) => {
    try {

      const {
        FromDateFilter,
        ToDateFilter,
      } = data;

      const params = new URLSearchParams();
      if (FromDateFilter) params.append("FromDateFilter", FromDateFilter);
      if (ToDateFilter) params.append("ToDateFilter", ToDateFilter);
      const query = params.toString();

      const response = await invoiceApiUrl.get(
        `/History/statistics/by-date/by-currency?${query}`,
      );
      return response?.data;
    } catch (error) {
      handleErrors(error.response.data);
      throw error;
    }
  },

  getAllInvoices: async () => {
    try {
      const response = await invoiceApiUrl.get(
        `/Invoice/all/get`,
      );
      return response?.data;
    } catch (error) {
      handleErrors(error.response.data);
      throw error;
    }
  },

  getFilteredInvoices: async (data) => {
    try {
      const {
        InvoiceTypeCodeFilter,
        FromDateFilter,
        ToDateFilter,
        Filter,
        Sorting,
        MaxResultCount,
        SkipCount
      } = data;

      const params = new URLSearchParams();
      if (InvoiceTypeCodeFilter) params.append("InvoiceTypeCodeFilter", InvoiceTypeCodeFilter);
      if (FromDateFilter) params.append("FromDateFilter", FromDateFilter);
      if (ToDateFilter) params.append("ToDateFilter", ToDateFilter);
      if (Filter) params.append("Filter", Filter);
      if (Sorting) params.append("Sorting", Sorting);
      if (MaxResultCount !== undefined) params.append("MaxResultCount", MaxResultCount);
      if (SkipCount !== undefined) params.append("SkipCount", SkipCount);
      const query = params.toString();

      const response = await invoiceApiUrl.get(
        `/Invoice/filtered/get?${query}`,
      );
      return response?.data;
    } catch (error) {
      handleErrors(error.response.data);
      throw error;
    }
  },

  getQRCode: async (data) => {
    try {
      const response = await invoiceApiUrl.post(
        `/Invoice/qrcode/generate`, data
      );
      return response?.data;
    } catch (error) {
      handleErrors(error.response);
      throw error;
    }
  },

  transmitInvoice: async (data) => {
    try {
      const { irn } = data;
      const response = await invoiceApiUrl.post(
        `/Invoice/transmit?irn=${irn}`
      );
      return response?.data;
    } catch (error) {
      handleErrors(error.response);
      throw error;
    }
  },

  changeStatus: async (data) => {
    try {
      const response = await invoiceApiUrl.put(
        `/Invoice/update`, data
      );
      return response?.data;
    } catch (error) {
      handleErrors(error.response);
      throw error;
    }
  },

};

export default invoiceService;
