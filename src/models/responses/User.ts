import Plan from "./Plan";
import UserInfo from "./UserInfo";

export default interface User {
  id: number;
  username: string;
  email: string;
  plans?: Plan[];
  info: UserInfo;
}
