import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import { serviceGetLatestAcceptance } from "../../services";

export const getLatestAceptance = createAsyncThunk(
  "acceptance/getLatestAceptance",
  async (lang: string) => {
    const [response, error] = await serviceGetLatestAcceptance(lang);
    if (error !== null) {
      error.message && enqueueSnackbar(error.message, { variant: "error" });
      return null;
    }
    return response;
  }
);
