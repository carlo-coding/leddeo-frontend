import {
  ICreateCheckoutSessionPayload,
  ICreatePortalSessionPaylod,
  IUrlResponse,
} from "../../models";
import { request } from "../../utils";

import { CheckoutServiceEndpoints } from "./endpoints";

export async function serviceCheckoutSession(
  payload: ICreateCheckoutSessionPayload
) {
  const resp = await request<IUrlResponse>({
    endpoint: CheckoutServiceEndpoints.CREATE_CHECKOUT_SESSION,
    method: "POST",
    body: payload,
    isProtected: true,
  });
  return resp;
}

export async function servicePortalSession(
  payload: ICreatePortalSessionPaylod
) {
  const resp = await request<IUrlResponse>({
    endpoint: CheckoutServiceEndpoints.CREATE_PORTAL_SESSION,
    method: "POST",
    body: payload,
    isProtected: true,
  });
  return resp;
}
