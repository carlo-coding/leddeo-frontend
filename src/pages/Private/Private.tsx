import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import { RoutesWith404 } from "../../components";
import { PrivateRoutes } from "../../models";

const Dashboard = lazy(async () => await import("../Dashboard/Dashboard"));
const Profile = lazy(async () => await import("../Profile/Profile"));
const History = lazy(async () => await import("../History/History"));

function Private() {
  return (
    <RoutesWith404>
      <Route path="/" element={<Navigate to={PrivateRoutes.PROFILE} />} />
      <Route path={PrivateRoutes.DASHBOARD} element={<Dashboard />} />
      <Route path={PrivateRoutes.HISTORY} element={<History />} />
      <Route path={PrivateRoutes.PROFILE} element={<Profile />} />
    </RoutesWith404>
  );
}
export default Private;
