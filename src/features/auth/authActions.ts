import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import {
  IGetTokenPayload,
  IGoogleRegister,
  ISignUpPayload,
  PrivateRoutes,
} from "../../models";
import {
  serviceGetToken,
  serviceGoogleAuth,
  serviceRegister,
} from "../../services";
import { redirectTo, setCookie } from "../../utils";

export const signup = createAsyncThunk(
  "auth/signup",
  async (payload: ISignUpPayload) => {
    const [, error] = await serviceRegister(payload);
    if (error !== null) {
      return enqueueSnackbar(error.message, { variant: "error" });
    }
    redirectTo("/login");
  }
);

export const googleAuth = createAsyncThunk(
  "auth/signup",
  async (payload: IGoogleRegister) => {
    const [response, error] = await serviceGoogleAuth(payload);
    if (error !== null) {
      return enqueueSnackbar(error.message, { variant: "error" });
    }
    if (response !== null) {
      setCookie("refresh", response.refresh);
      setCookie("access", response.access);

      redirectTo(PrivateRoutes.PRIVATE);
    }
  }
);

/* export const refreshToken = createAsyncThunk("auth/refreshToken", async () => {
  const [response, error] = await serviceRefreshToken({
    refresh: getCookie("refresh"),
  });
  if (error !== null) {
    return enqueueSnackbar(error.message, { variant: "error" });
  }
  if (response !== null) {
    setCookie("refresh", response.refresh);
    setCookie("access", response.access);
  }
}); */

export const login = createAsyncThunk(
  "auth/login",
  async (payload: IGetTokenPayload) => {
    const [response, error] = await serviceGetToken(payload);
    if (error !== null) {
      return enqueueSnackbar(error.message, { variant: "error" });
    }
    if (response != null) {
      setCookie("refresh", response.refresh);
      setCookie("access", response.access);

      redirectTo(PrivateRoutes.PRIVATE);
    }
  }
);
