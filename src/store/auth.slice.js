import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { getDeviceDetails } from "../../utils/deviceDetails";
import authService from "../services/authService";

export const getToken = createAsyncThunk(
  "auth/getToken",
  async (data) => {
    try {
      resetAuthDetails();
      const response = await authService.getToken(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);


const loadFromSessionStorage = () => {
  const data = sessionStorage.getItem("auth");
  return data ? JSON.parse(data) : null;
};

const initialState = {
  token: null,
  loading: false,
  ...loadFromSessionStorage(),
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthDetails: (_, action) => {
      // saveToSessionStorage(action.payload.data.result.data);
      sessionStorage.setItem("authToken", action.payload?.result?.data);
    },
    resetAuthDetails: (state) => {
      state.token = null;
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("auth");
    },
    loadAuthDetailsFromStorage: (state) => {
      const data = loadFromSessionStorage();
      if (data) {
        state.token = data.token;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.result?.data || null;
        sessionStorage.setItem("authToken", state.token);
        // saveToSessionStorage({ "token": state.token });
      })
      .addCase(getToken.rejected, (state) => {
        state.loading = false;
      });
  },
});


export const { setAuthDetails, resetAuthDetails, loadAuthDetailsFromStorage } =
  authSlice.actions;

export default authSlice.reducer;
