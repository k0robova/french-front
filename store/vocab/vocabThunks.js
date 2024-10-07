import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchVocab } from "../../services/vocabService";

export const getVocab = createAsyncThunk(
  "/vocab",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchVocab(id);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);
