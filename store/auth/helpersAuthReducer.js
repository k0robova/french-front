export const handlePending = (state) => {
  state.isRefreshing = true;
};

export const handleFulfilledLogin = (state, { payload }) => {
  state.isRefreshing = false;
  state.error = "";
  state.token = payload.token;
  state.user = payload.user;
  state.isLoggedIn = true;
};

export const handleFulfilledRegister = (state, { payload }) => {
  state.isRefreshing = false;
  state.error = "";
  state.token = payload.token;
  state.user = payload.user;
  state.isLoggedIn = true;
};

export const handleFulfilledProfile = (state, { payload }) => {
  state.isLoggedIn = true;
  state.isRefreshing = false;
  state.error = "";
  state.user = payload;
};

export const handleFulfilledLogout = (state, _) => {
  state.isRefreshing = false;
  state.error = "";
  state.user = null;
  state.token = null;
  state.isLoggedIn = false;
};

export const handleFulfilledUpdateUserData = (state, { payload }) => {
  state.isRefreshing = false;
  state.error = "";
  state.user = payload;
};

export const handleFulfilledUpdateTheme = (state, { payload }) => {
  state.isRefreshing = false;
  state.error = "";
  state.user.theme = payload.theme;
};

export const handleFulfilledUpdateLng = (state, { payload }) => {
  state.isRefreshing = false;
  state.error = "";
  state.user.lng = payload.lng;
};

export const handleFulfilledUpdatePassword = (state, { payload }) => {
  state.isRefreshing = false;
  state.error = "";
};

export const handleRejected = (state, { payload }) => {
  state.isRefreshing = false;
  state.error = payload;
};
