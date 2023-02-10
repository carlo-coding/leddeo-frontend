import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import {
  IGetTokenPayload,
  IRefreshTokenPayload,
  ISignUpPayload,
  PrivateRoutes,
} from "../../models";
import {
  serviceGetToken,
  serviceGoogleAuth,
  serviceRefreshToken,
  serviceRegister,
} from "../../services";
import { getCookie, redirectTo, setCookie } from "../../utils";

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
  async (payload: string) => {
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

export const refreshToken = createAsyncThunk("auth/refreshToken", async () => {
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
});

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
