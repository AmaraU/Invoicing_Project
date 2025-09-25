import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import invoiceService from "../services/invoiceService";

export const getStatisticsByDate = createAsyncThunk(
  "History/statistics/by-date",
  async (data) => {
    try {
      const response = await invoiceService.getStatisticsByDate(data);
      return response;
    } catch (error) { throw error; }
  }
);

export const getStatisticsByCurrency = createAsyncThunk(
  "History/statistics/by-currency",
  async (data) => {
    try {
      const response = await invoiceService.getStatisticsByCurrency(data);
      return response;
    } catch (error) { throw error; }
  }
);

export const getStatisticsByDateByCurrency = createAsyncThunk(
  "History/statistics/by-date/by-currency",
  async (data) => {
    try {
      const response = await invoiceService.getStatisticsByDateByCurrency(data);
      return response;
    } catch (error) { throw error; }
  }
);

export const getAllInvoices = createAsyncThunk(
  "Invoice/all/get",
  async () => {
    try {
      const response = await invoiceService.getAllInvoices();
      return response;
    } catch (error) { throw error; }
  }
);

export const getFilteredInvoices = createAsyncThunk(
  "Invoice/filtered/get",
  async (data) => {
    try {
      const response = await invoiceService.getFilteredInvoices(data);
      return response;
    } catch (error) { throw error; }
  }
);

const initialState = {
  statisticsByDate: [],
  statisticsByCurrency: [],
  statisticsByDC: [],
  invoices: [],
  filteredInvoices: [],
  loading: {
    statByDate: false,
    statByCurren: false,
    statByDC: false,
    allInvoices: false,
    filteredInvoices: false,
  },
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStatisticsByDate.pending, (state) => {
        state.loading.statByDate = true;
        state.statisticsByDate = [];
      })
      .addCase(getStatisticsByDate.fulfilled, (state, action) => {
        state.loading.statByDate = false;
        state.statisticsByDate = action.payload?.result?.data || [];
      })
      .addCase(getStatisticsByDate.rejected, (state) => {
        state.loading.statByDate = false;
      })

      .addCase(getStatisticsByCurrency.pending, (state) => {
        state.loading.statByCurren = true;
        state.statisticsByCurrency = [];
      })
      .addCase(getStatisticsByCurrency.fulfilled, (state, action) => {
        state.loading.statByCurren = false;
        state.statisticsByCurrency = action.payload?.result?.data || [];
      })
      .addCase(getStatisticsByCurrency.rejected, (state) => {
        state.loading.statByCurren = false;
      })

      .addCase(getStatisticsByDateByCurrency.pending, (state) => {
        state.loading.statByDC = true;
        state.statisticsByDC = [];
      })
      .addCase(getStatisticsByDateByCurrency.fulfilled, (state, action) => {
        state.loading.statByDC = false;
        state.statisticsByDC = action.payload?.result?.data || [];
      })
      .addCase(getStatisticsByDateByCurrency.rejected, (state) => {
        state.loading.statByDC = false;
      })

      .addCase(getAllInvoices.pending, (state) => {
        state.loading.allInvoices = true;
        state.invoices = [];
      })
      .addCase(getAllInvoices.fulfilled, (state, action) => {
        state.loading.allInvoices = false;
        state.invoices = action.payload?.result?.data || [];
      })
      .addCase(getAllInvoices.rejected, (state) => {
        state.loading.allInvoices = false;
      })

      .addCase(getFilteredInvoices.pending, (state) => {
        state.loading.filteredInvoices = true;
        state.filteredInvoices = [];
      })
      .addCase(getFilteredInvoices.fulfilled, (state, action) => {
        state.loading.filteredInvoices = false;
        state.filteredInvoices = action.payload?.result?.data || [];
      })
      .addCase(getFilteredInvoices.rejected, (state) => {
        state.loading.filteredInvoices = false;
      });
  },
});

export default invoiceSlice.reducer;
