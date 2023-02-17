import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getFaqs,
  getFontsList,
  getLatestAceptance,
  getUser,
  loadFonts,
} from "../../features";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import Box from "@mui/material/Box";

interface InitLoadsProps {
  children?: React.ReactElement;
}

function InitLoads({ children }: InitLoadsProps) {
  const dispatch = useAppDispatch();

  const preferredLang = useAppSelector((state) => state.lang.preferredLanguage);
  const action = (snackbarId: string) => (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => {
            closeSnackbar(snackbarId);
          }}
        >
          Ok
        </button>
      </Box>
    </>
  );
  useEffect(() => {
    dispatch(getUser());
    dispatch(getFaqs());
    dispatch(getFontsList());
    dispatch(loadFonts());

    /* enqueueSnackbar(
      `LEDDEO te da la bienvenida a la Beta gratuita
      Recuerda que esto es una versión temprana de LEDDEO por lo que si experimentas un error o quieres mejorar algo mándanos un correo a support@leddeo.com`,
      {
        action: action as any,
        autoHideDuration: 60 * 1000,
      }
    ); */
  }, []);

  useEffect(() => {
    dispatch(getLatestAceptance(preferredLang));
  }, [preferredLang]);
  return <>{children}</>;
}
export default InitLoads;
