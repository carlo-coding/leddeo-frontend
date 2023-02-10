import { IUpdateUserPayload, User } from "../../models";
import { getCookie, request, setCookie, deleteCookie } from "../../utils";
import { serviceRefreshToken } from "../authService";
import { UserServiceEndpoints } from "./endpoints";

export async function serviceGetUserInfo(): Promise<[any, any]> {
  const [user, error] = await request<User>({
    endpoint: UserServiceEndpoints.GET_PROFILE,
    codeMessages: {
      401: "",
    },
    isProtected: true,
  });
  if (error) {
    const refresh = getCookie("refresh");
    if (!refresh) return [user, error];
    const [tokens, fail] = await serviceRefreshToken({ refresh });
    if (tokens) {
      setCookie("refresh", tokens.refresh);
      setCookie("access", tokens.access);
      return await serviceGetUserInfo();
    }
    if (fail) {
      deleteCookie("refresh");
      deleteCookie("access");
      return [user, error];
    }
  }
  return [user, error];
}

export async function serviceUpdateUserInfo(payload: IUpdateUserPayload) {
  const resp = await request<User>({
    endpoint: UserServiceEndpoints.UPDATE_PROFILE,
    method: "PUT",
    body: payload,
    codeMessages: {
      404: "No se encontró ningún usuario",
      400: "Los datos enviados no son válidos",
    },
    isProtected: true,
  });
  return resp;
}
