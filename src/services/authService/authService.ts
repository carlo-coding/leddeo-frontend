import {
  IGetTokenPayload,
  IGoogleRegister,
  ISignUpPayload,
} from "../../models";
import { request } from "../../utils";
import { AuthServiceEndpoints } from "./endpoints";

export async function serviceRegister(payload: ISignUpPayload) {
  const resp = await request({
    endpoint: AuthServiceEndpoints.REGISTER,
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/json" },
    codeMessages: {
      "400": "Un usuario con ese nombre ya existe",
    },
  });
  return resp;
}

export async function serviceGetToken(payload: IGetTokenPayload) {
  const response = await request<{
    access: string;
    refresh: string;
  }>({
    endpoint: AuthServiceEndpoints.GET_TOKEN,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    codeMessages: {
      "401": "Usuario o contraseña incorrectos",
    },
    usesPrefix: false,
  });
  return response;
}

/* export async function serviceRefreshToken(payload: IRefreshTokenPayload) {
  const resp = await request<{
    access: string;
    refresh: string;
  }>({
    endpoint: AuthServiceEndpoints.REFRESH_TOKEN,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    isProtected: true,
    usesPrefix: false,
  });
  return resp;
} */

export async function serviceGoogleAuth(payload: IGoogleRegister) {
  const resp = await request<{
    access: string;
    refresh: string;
  }>({
    endpoint: AuthServiceEndpoints.GOOGLE_AUTH,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });
  return resp;
}
