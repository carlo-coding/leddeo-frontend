import { IHistoryItem } from "../../../models";
import { IAsyncStatus } from "../../common";

export interface IHistoryState {
  data: IHistoryItem[];
  status: IAsyncStatus;
}
