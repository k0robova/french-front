import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTopic } from "../../services/themeService";

export const getVocab = createAsyncThunk("/theme", async (rejectWithValue) => {
  try {
    return await fetchTopic();
  } catch (error) {
    console.log(error);
    return rejectWithValue(error.message);
  }
});
