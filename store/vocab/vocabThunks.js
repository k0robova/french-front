import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchVocab } from "../../services/vocabService";

export const getVocab = createAsyncThunk("/vocab", async (rejectWithValue) => {
  try {
    return await fetchVocab();
  } catch (error) {
    console.log(error);
    return rejectWithValue(error.message);
  }
});
