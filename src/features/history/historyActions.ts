import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import { serviceGetHistory } from "../../services";

export const getHistory = createAsyncThunk("history/getHistory", async () => {
  const [resp, error] = await serviceGetHistory();
  if (error !== null) {
    enqueueSnackbar(error.message, { variant: "error" });
    return [];
  }
  return resp || [];
});
