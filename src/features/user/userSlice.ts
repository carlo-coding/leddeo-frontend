import { createSlice } from "@reduxjs/toolkit";
import { IAsyncStatus } from "../common";
import { IUserState } from "./interfaces/UserState";
import { getUser, updateUser } from "./userActions";

const initialState: IUserState = {
  data: null,
  status: IAsyncStatus.FULFILLED,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUser.pending, (state) => {
      state.status = IAsyncStatus.PENDING;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.status = IAsyncStatus.FAILED;
      state.data = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.status = IAsyncStatus.FULFILLED;
      state.data = action.payload;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.status = IAsyncStatus.PENDING;
    });
    builder.addCase(updateUser.rejected, (state) => {
      state.status = IAsyncStatus.FAILED;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.status = IAsyncStatus.FULFILLED;
      state.data = action.payload;
    });
  },
});

export default userSlice.reducer;
