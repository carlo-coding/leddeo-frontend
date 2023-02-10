import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../utils";

function AuthGuard(): JSX.Element {
  const token = getCookie("access");
  return token ? <Outlet /> : <Navigate to="/" />;
}
export default AuthGuard;
