import { createSlice } from "@reduxjs/toolkit";
import { AuthInitialState } from "./interfaces/initialState";
import { getUser } from "../user";

const initialState: AuthInitialState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isAuthenticated = Boolean(action.payload?.email);
    });
    builder.addCase(getUser.rejected, (state) => {
      state.isAuthenticated = false;
    });
  },
});

export default authSlice.reducer;
