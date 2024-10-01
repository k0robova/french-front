export const handlePending = (state) => {
  state.isLoading = true;
};

export const handleFulfilledGetTopic = (state, { payload }) => {
  state.isLoading = false;
  state.error = null;
  state.topic = payload;
};

export const handleRejected = (state, { payload }) => {
  state.isLoading = false;
  state.error = payload;
};
