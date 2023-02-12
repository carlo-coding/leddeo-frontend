import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { modalSlice } from "../components";
import { sidebarSlice } from "../components/Sidebar";
import {
  authSlice,
  faqSlice,
  historySlice,
  subtitleSlice,
  userSlice,
  videoSlice,
} from "../features";
import fontSlice from "../features/font/fontSlice";

export const store = configureStore({
  reducer: {
    video: videoSlice,
    subtitle: subtitleSlice,
    modal: modalSlice,
    history: historySlice,
    user: userSlice,
    faq: faqSlice,
    auth: authSlice,
    sidebar: sidebarSlice,
    font: fontSlice,
  },
  middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
