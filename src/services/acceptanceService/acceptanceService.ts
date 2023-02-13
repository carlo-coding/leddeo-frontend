import { IAcceptance } from "../../models";
import { request } from "../../utils";
import { AcceptanceServiceEndpoints } from "./endpoints";

export async function serviceGetLatestAcceptance(lang: string = "es") {
  const resp = await request<IAcceptance>({
    endpoint: `${AcceptanceServiceEndpoints.GET_LATEST}${lang}`,
    codeMessages: {
      404: "",
    },
  });
  return resp;
}
