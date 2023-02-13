import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import { serviceGetLatestAcceptance } from "../../services";

export const getLatestAceptance = createAsyncThunk(
  "acceptance/getLatestAceptance",
  async () => {
    const [response, error] = await serviceGetLatestAcceptance();
    if (error !== null) {
      enqueueSnackbar(error.message, { variant: "error" });
      return null;
    }
    return response;
  }
);
