import { IHistoryItem } from "../../models";
import { request } from "../../utils";
import { HistoryServiceEndpoints } from "./endpoints";

export async function serviceGetHistory() {
  const resp = await request<IHistoryItem[]>({
    endpoint: HistoryServiceEndpoints.GET_HISTORY,
    codeMessages: {
      404: "Usuario encontrado",
      401: "No autorizado",
    },
    isProtected: true,
  });
  return resp;
}
