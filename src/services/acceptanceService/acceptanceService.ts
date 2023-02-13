import { IAcceptance } from "../../models";
import { request } from "../../utils";
import { AcceptanceServiceEndpoints } from "./endpoints";

export async function serviceGetLatestAcceptance() {
  const resp = await request<IAcceptance>({
    endpoint: AcceptanceServiceEndpoints.GET_LATEST,
  });
  return resp;
}
