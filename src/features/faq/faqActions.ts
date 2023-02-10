import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import { serviceGetFaqs } from "../../services";

export const getFaqs = createAsyncThunk("faq/getFaqs", async () => {
  const [response, error] = await serviceGetFaqs();
  if (error !== null) {
    enqueueSnackbar(error.message, { variant: "error" });
    return [];
  }
  if (response !== null) {
    return response;
  }
  return [];
});
