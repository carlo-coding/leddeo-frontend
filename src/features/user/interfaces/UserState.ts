import { User } from "../../../models";
import { IAsyncStatus } from "../../common";

export interface IUserState {
  data: User | null;
  status: IAsyncStatus;
}
