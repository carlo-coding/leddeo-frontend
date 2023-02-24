import { IHistory } from "../../../models";
import { IAsyncStatus } from "../../common";

export interface IHistoryState {
  data: IHistory[];
  status: IAsyncStatus;
}
