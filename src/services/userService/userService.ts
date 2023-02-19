import { IUpdateUserPayload, User } from "../../models";
import { getCookie, request, setCookie, deleteCookie } from "../../utils";
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
    deleteCookie("refresh");
    deleteCookie("access");
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
