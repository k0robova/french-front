export const handlePending = (state) => {
  state.isLoading = true;
};

export const handleFulfilledGetVocab = (state, { payload }) => {
  state.isLoading = false;
  state.error = null;
  state.vocab = payload;
};

export const handleRejected = (state, { payload }) => {
  state.isLoading = false;
  state.error = payload;
};
