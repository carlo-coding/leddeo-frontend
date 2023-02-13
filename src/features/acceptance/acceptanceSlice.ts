import { createSlice } from "@reduxjs/toolkit";
import { getLatestAceptance } from "./acceptanceActions";
import { AcceptanceState } from "./interfaces";

const initialState: AcceptanceState = {
  latest: null,
};

const acceptanceSlice = createSlice({
  name: "acceptance",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getLatestAceptance.fulfilled, (state, action) => {
      if (action.payload) state.latest = action.payload;
    });
  },
});

export default acceptanceSlice.reducer;
