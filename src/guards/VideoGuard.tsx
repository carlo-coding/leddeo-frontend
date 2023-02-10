import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

function VideoGuard(): JSX.Element {
  const video = useAppSelector((state) => state.video.video);
  return video !== null ? <Outlet /> : <Navigate to="/" />;
}
export default VideoGuard;
