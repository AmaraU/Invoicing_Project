import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import utilsService from "../services/utilsService";

export const getNationalities = createAsyncThunk(
  "utils/getNationalities",
  async () => {
    try {
      const response = await utilsService.getNationaties();
      return response;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
);

export const getStates = createAsyncThunk(
  "utils/getStates",
  async () => {
    try {
      const response = await utilsService.getStates();
      return response;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
);

export const getTowns = createAsyncThunk(
  "utils/getTowns",
  async (data) => {
    try {
      const response = await utilsService.getTowns(data);
      return response;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
);

export const getSourceOfFunds = createAsyncThunk(
  "utils/getSourceOfFunds",
  async () => {
    try {
      const response = await utilsService.getSourceOfFunds();
      return response;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
);

export const getOccupations = createAsyncThunk(
  "utils/getOccupations",
  async () => {
    try {
      const response = await utilsService.getOccupations();
      return response;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
);

export const getTitles = createAsyncThunk(
  "utils/getTitles",
  async () => {
    try {
      const response = await utilsService.getTitles();
      return response;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
);

export const getSecurityQuestions = createAsyncThunk(
  "utils/getSecurityQuestions",
  async () => {
    try {
      const response = await utilsService.getSecurityQuestion();
      return response;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
);

const initialState = {
  loading: false,
  nationalities: [],
  states: [],
  towns: [],
  sourceOfFunds: [],
  occupations: [],
  titles: [],
  securityQuestions: [],
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNationalities.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNationalities.fulfilled, (state, action) => {
        state.loading = false;
        state.nationalities = action.payload.data;
      })
      .addCase(getNationalities.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getStates.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload.result.data;
      })
      .addCase(getStates.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getTowns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTowns.fulfilled, (state, action) => {
        state.loading = false;
        state.towns = action.payload.result.data;
      })
      .addCase(getTowns.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getSourceOfFunds.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSourceOfFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.sourceOfFunds = action.payload.data;
      })
      .addCase(getSourceOfFunds.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getOccupations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOccupations.fulfilled, (state, action) => {
        state.loading = false;
        state.occupations = action.payload.data;
      })
      .addCase(getOccupations.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getTitles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTitles.fulfilled, (state, action) => {
        state.loading = false;
        state.titles = action.payload.data;
      })
      .addCase(getTitles.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getSecurityQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSecurityQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.securityQuestions = action.payload.result.data;
      })
      .addCase(getSecurityQuestions.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default utilsSlice.reducer;
