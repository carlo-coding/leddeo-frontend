import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import {
  ICreateCheckoutSessionPayload,
  ICreatePortalSessionPaylod,
} from "../../models";
import { serviceCheckoutSession, servicePortalSession } from "../../services";

export const checkoutSession = createAsyncThunk(
  "checkout/checkoutSession",
  async (payload: ICreateCheckoutSessionPayload) => {
    const [resp, error] = await serviceCheckoutSession(payload);
    if (error !== null) {
      enqueueSnackbar(error.message, { variant: "error" });
      return null;
    }
    if (resp) {
      window.location.assign(resp.url);
    }
  }
);

export const portalSession = createAsyncThunk(
  "checkout/portalSession",
  async (payload: ICreatePortalSessionPaylod) => {
    const [resp, error] = await servicePortalSession(payload);
    if (error !== null) {
      enqueueSnackbar(error.message, { variant: "error" });
      return null;
    }
    if (resp) {
      window.location.assign(resp.url);
    }
  }
);
