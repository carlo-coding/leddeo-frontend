import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getDownloadDuration,
  getTranscripDuration,
  getTranslateDuration,
} from "./durationActions";
import { DurationState } from "./interfaces";

const initialState: DurationState = {
  seconds: 0,
};

const durationSlice = createSlice({
  name: "faq",
  initialState: initialState,
  reducers: {
    setSecondsDuration(state, action: PayloadAction<number>) {
      state.seconds = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getTranscripDuration.fulfilled, (state, action) => {
      if (action.payload?.prediction)
        state.seconds = action.payload?.prediction;
    });
    builder.addCase(getTranslateDuration.fulfilled, (state, action) => {
      if (action.payload?.prediction)
        state.seconds = action.payload?.prediction;
    });
    builder.addCase(getDownloadDuration.fulfilled, (state, action) => {
      if (action.payload?.prediction)
        state.seconds = action.payload?.prediction;
    });
  },
});

export const { setSecondsDuration } = durationSlice.actions;

export default durationSlice.reducer;
