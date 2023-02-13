import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
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

  const preferredLang = useAppSelector((state) => state.lang.preferredLanguage);

  useEffect(() => {
    dispatch(getUser());
    dispatch(getFaqs());
    dispatch(getFontsList());
    dispatch(loadFonts());
  }, []);

  useEffect(() => {
    dispatch(getLatestAceptance(preferredLang));
  }, [preferredLang]);
  return <>{children}</>;
}
export default InitLoads;
