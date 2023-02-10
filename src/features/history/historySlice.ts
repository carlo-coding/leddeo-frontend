import { createSlice } from "@reduxjs/toolkit";
import { IAsyncStatus } from "../common";
import { getHistory } from "./historyActions";
import { IHistoryState } from "./interfaces/historyState";

const initialState: IHistoryState = {
  data: [],
  status: IAsyncStatus.FULFILLED,
};

const historySlice = createSlice({
  name: "history",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getHistory.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = IAsyncStatus.FULFILLED;
    });
    builder.addCase(getHistory.pending, (state) => {
      state.status = IAsyncStatus.PENDING;
    });
    builder.addCase(getHistory.rejected, (state) => {
      state.status = IAsyncStatus.FAILED;
      state.data = [];
    });
  },
});

export default historySlice.reducer;
