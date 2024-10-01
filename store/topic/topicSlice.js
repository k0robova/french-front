import { createSlice } from "@reduxjs/toolkit";
import * as topicThunk from "./topicSlice.js";
import * as HelpresReducer from "./helpersTopicRefucer.js";

const initialState = {
  topic: [],
  isloading: false,
  error: null,
};

const topicSlice = createSlice({
  name: "topic",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(
        topicThunk.getTopic.fulfilled,
        HelpresReducer.handleFulfilledGetTopic
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

export const topicReducer = topicSlice.reducer;
