import { IFaqItem, TSubtitleItem } from "../../models/responses";
import { request } from "../../utils";
import { FaqServiceEndpoints } from "./endpoints";

export async function serviceGetFaqs() {
  const resp = await request<IFaqItem[]>({
    endpoint: FaqServiceEndpoints.GET_ALL,
    method: "GET",
    codeMessages: {
      500: "Error interno del servidor",
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return resp;
}
