import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISidebarState } from "./interfaces";

const initialState: ISidebarState = {
  open: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.open = !state.open;
    },
    closeSidebar(state) {
      state.open = false;
    },
  },
});

export default sidebarSlice.reducer;

export const { toggleSidebar, closeSidebar } = sidebarSlice.actions;
