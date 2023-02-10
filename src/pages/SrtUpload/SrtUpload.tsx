import Box from "@mui/material/Box";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { FileUpload, Layout } from "../../components";
import { setSubtitleList } from "../../features/subtitle/subtitleSlice";
import { PublicRoutes } from "../../models";
import { validateSrtFile } from "../../utils";

function SrtUpload() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleFileUpload = async (files: (null | File)[]) => {
    const srtArray = await validateSrtFile(files[0]);
    if (srtArray) {
      dispatch(setSubtitleList(srtArray));
      return navigate(`/${PublicRoutes.EDITOR}`, { replace: true });
    }
    enqueueSnackbar("El archivo no tiene un formato srt válido", {
      variant: "error",
    });
  };
  return (
    <Layout>
      <Box
        sx={{
          textAlign: "center",
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
          "& .upload-area": {
            width: {
              md: "530px",
              xs: "80vw",
            },
            padding: "1em 1.5em",
            backgroundColor: "layout.mediumGray",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
          "& .upload-button": {
            borderColor: "layout.navyBlue",
            color: "layout.navyBlue",
            background: "transparent",
            fontSize: "20px",
            border: "2.5px solid",
            padding: "1.5em",
          },
          "& .upload-title": {
            fontSize: {
              md: "30px",
              xs: "25px",
            },
            margin: "1.5em 0",
          },
          "& .upload-subtitle": {
            marginBottom: "2.5em",
          },
          "& .upload-subbutton": {
            margin: "1.5em 0",
          },
        }}
      >
        <FileUpload
          onFilesAdded={handleFileUpload}
          title="Ahora, sube un archivo SRT para continuar el proyecto"
          subbutton="O arrastra un archivo aquí"
        >
          Suelta aquí tu archivo SRT
        </FileUpload>
      </Box>
    </Layout>
  );
}
export default SrtUpload;
