import { createSlice } from "@reduxjs/toolkit";
import * as authThunks from "./authThunks";
import * as HelpersReducer from "./helpersAuthReducer";

const initialState = {
  user: { name: null, email: null, birthDate: null, lng: null, theme: null },
  token: null,
  isRefreshing: false,
  error: "",
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(
        authThunks.loginThunk.fulfilled,
        HelpersReducer.handleFulfilledLogin
      )
      .addCase(
        authThunks.registerThunk.fulfilled,
        HelpersReducer.handleFulfilledRegister
      )
      .addCase(
        authThunks.getProfileThunk.fulfilled,
        HelpersReducer.handleFulfilledProfile
      )
      .addCase(
        authThunks.logoutThunk.fulfilled,
        HelpersReducer.handleFulfilledLogout
      )
      .addCase(
        authThunks.updaterUserData.fulfilled,
        HelpersReducer.handleFulfilledUpdateUserData
      )
      .addCase(
        authThunks.updaterUserTheme.fulfilled,
        HelpersReducer.handleFulfilledUpdateTheme
      )
      .addCase(
        authThunks.updaterPassword.fulfilled,
        HelpersReducer.handleFulfilledUpdatePassword
      )
      .addCase(
        authThunks.updateUserLng.fulfilled,
        HelpersReducer.handleFulfilledUpdateLng
      )
      .addMatcher(
        (action) => action.type.endsWith("pending"),
        HelpersReducer.handlePending
      )
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        HelpersReducer.handleRejected
      );
  },
});
