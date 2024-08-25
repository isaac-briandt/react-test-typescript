import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { toast } from "react-toastify";
import { ApiErrorResponse, UserData } from "../../interface/auth";

import { AxiosError } from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async (
    params: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post("/user/login", params);

      if ("token" in data) {
        window.localStorage.setItem("token", data.token);
        await dispatch(account());
      }

      return data;
    } catch (error) {
      if (
        (error as AxiosError<ApiErrorResponse>).response?.status === 400 ||
        (error as AxiosError<ApiErrorResponse>).response?.status === 400
      ) {
        if ((error as AxiosError<ApiErrorResponse>).response?.data.message) {
          return rejectWithValue(
            (error as AxiosError<ApiErrorResponse>).response?.data.message
          );
        }
        return rejectWithValue(
          (error as AxiosError<ApiErrorResponse>).response?.data
        );
      }
      rejectWithValue("Oops something went wrong!");
      throw (
        (error as AxiosError<ApiErrorResponse>).response?.data.message ??
        "An error occurred signing up. Please try again."
      );
    }
  }
);

export const account = createAsyncThunk("auth/account", async () => {
  try {
    const { data } = await axios.get("/user/account");
    return data;
  } catch (error) {
    toast.error((error as string) ?? "An error occured!");
  }
});

const initialState: UserData = {
  data: null,
  status: "",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.data = null;
        state.status = "loading";
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "error";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(account.pending, (state) => {
        state.data = null;
        state.status = "loading";
      })
      .addCase(account.rejected, (state) => {
        state.data = null;
        state.status = "error";
      })
      .addCase(account.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
