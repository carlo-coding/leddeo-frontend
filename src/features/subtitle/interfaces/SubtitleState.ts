import { TSubtitleItem } from "../../../models/responses";
import { IAsyncStatus } from "../../common";

export interface TSubtitleState {
  list: TSubtitleItem[];
  status: IAsyncStatus;
  style: {
    vAlign: string;
    hAlign: string;
    font: string;
    color: string;
    size: number;
    bgcolor?: string;
  };
}
