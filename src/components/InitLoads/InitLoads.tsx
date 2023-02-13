import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  getFaqs,
  getFontsList,
  getLatestAceptance,
  getUser,
  loadFonts,
} from "../../features";

interface InitLoadsProps {
  children?: React.ReactElement;
}

function InitLoads({ children }: InitLoadsProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getFaqs());
    dispatch(getFontsList());
    dispatch(loadFonts());
    dispatch(getLatestAceptance());
  }, []);
  return <>{children}</>;
}
export default InitLoads;
