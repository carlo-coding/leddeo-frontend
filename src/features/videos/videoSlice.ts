import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IVideoState } from "./interfaces/VidesState";

const initialState: IVideoState = {
  video: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState: initialState,
  reducers: {
    setVideo(state, action: PayloadAction<File | null>) {
      state.video = action.payload;
    },
  },
});

export const { setVideo } = videoSlice.actions;
export default videoSlice.reducer;
