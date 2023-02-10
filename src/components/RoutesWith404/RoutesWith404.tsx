import { Route, Routes } from "react-router-dom";
import { NotFound } from "../NotFound";

interface IRoutesWith404Props {
  children: React.ReactNode;
}
function RoutesWith404({ children }: IRoutesWith404Props) {
  return (
    <Routes>
      {children}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default RoutesWith404;
