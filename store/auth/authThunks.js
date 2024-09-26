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

export const updaterPassword = createAsyncThunk(
  "/users/updatePassword",
  async (body, { rejectWithValue }) => {
    try {
      return await updatePassword(body);
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updaterUserTheme = createAsyncThunk(
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

export const updateUserLng = createAsyncThunk(
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

export const updaterUserData = createAsyncThunk(
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
