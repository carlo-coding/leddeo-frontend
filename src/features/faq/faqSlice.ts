import { createSlice } from "@reduxjs/toolkit";
import { getFaqs } from "./faqActions";
import { FaqState } from "./interfaces/faqState";

const initialState: FaqState = {
  data: [],
};

const faqSlice = createSlice({
  name: "faq",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getFaqs.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default faqSlice.reducer;
