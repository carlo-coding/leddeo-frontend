import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import { loadAllFonts, serviceGetFontsList } from "../../services";

export const getFontsList = createAsyncThunk("font/getFontsList", async () => {
  const [resp, error] = await serviceGetFontsList();
  if (error !== null) {
    enqueueSnackbar(error.message, { variant: "error" });
    return [];
  }
  return resp || [];
});

export const loadFonts = createAsyncThunk("font/getFontsList", async () => {
  const [resp, error] = await serviceGetFontsList();
  if (error !== null) {
    enqueueSnackbar(error.message, { variant: "error" });
    return [];
  }
  const list = resp || [];
  await loadAllFonts(list);
});
