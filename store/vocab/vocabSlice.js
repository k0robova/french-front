import { createSlice } from "@reduxjs/toolkit";
import * as vocabThunk from "./vocabThunks";
import * as HelpresReducer from "./helpersVocabRefucer";

const initialState = {
  vocab: [],
  isloading: false,
  error: null,
};

const vocabSlice = createSlice({
  name: "vocab",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(
        vocabThunk.getVocab.fulfilled,
        HelpresReducer.handleFulfilledGetVocab
      )
      .addMatcher(
        (action) => action.type.endsWith("pending"),
        HelpresReducer.handlePending
      )
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        HelpresReducer.handleRejected
      );
  },
});

export const vocabReducer = vocabSlice.reducer;
