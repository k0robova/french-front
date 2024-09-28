import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfile,
  logIn,
  logout,
  setToken,
  singUp,
  updateLng,
  updatePassword,
  updateTheme,
  updateUser,
  forgotPass,
  restorePassword,
} from "../../services/authService";

export const loginThunk = createAsyncThunk(
  "/users/login",
  async (body, { rejectWithValue }) => {
    try {
      return await logIn(body);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  "/users/register",
  async (body, { rejectWithValue }) => {
    try {
      return await singUp(body);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "/users/logout",
  async (_, { rejectWithValue }) => {
    try {
      return await logout();
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const getProfileThunk = createAsyncThunk(
  "/users/current",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    if (!token) {
      return thunkAPI.rejectWithValue("No token provided");
    }
    setToken(`Bearer ${token}`);
    try {
      const data = await getProfile();
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updaterPasswordThunk = createAsyncThunk(
  "/users/updatePassword",
  async (body, { rejectWithValue }) => {
    try {
      return await updatePassword(body);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const updaterUserThemeThunk = createAsyncThunk(
  "/users/theme",
  async (body, { rejectWithValue }) => {
    try {
      return await updateTheme(body);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserLngThunk = createAsyncThunk(
  "/users/lng",
  async (body, { rejectWithValue }) => {
    try {
      return await updateLng(body);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const updaterUserDataThunk = createAsyncThunk(
  "/users/update",
  async (body, { rejectWithValue }) => {
    try {
      return await updateUser(body);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassThunk = createAsyncThunk(
  "/users/forgotPassword",
  async (body, { rejectWithValue }) => {
    try {
      return await forgotPass(body);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const restorePasswordThunk = createAsyncThunk(
  "/users/restorePassword",
  async ({ body, otp }, { rejectWithValue }) => {
    try {
      return await restorePassword(otp, body);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
