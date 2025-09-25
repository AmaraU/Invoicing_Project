import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth.slice";
import invoiceSlice from "./invoice.slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    invoice: invoiceSlice,
  },
});




