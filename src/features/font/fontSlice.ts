import { createSlice } from "@reduxjs/toolkit";
import { IAsyncStatus } from "../common";
import { getFontsList } from "./fontActions";
import { FontState } from "./interfaces";

const initialState: FontState = {
  list: [],
  status: IAsyncStatus.PENDING,
};

const fontSlice = createSlice({
  name: "font",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getFontsList.pending, (state) => {
      state.status = IAsyncStatus.PENDING;
    });
    builder.addCase(getFontsList.rejected, (state) => {
      state.status = IAsyncStatus.FAILED;
    });
    builder.addCase(getFontsList.fulfilled, (state, action) => {
      if (action.payload)
        state.list = action.payload
          .map((f) => f.slice(0, -4).toLowerCase())
          .sort();
      state.status = IAsyncStatus.FULFILLED;
    });
  },
});

export default fontSlice.reducer;
