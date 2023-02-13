import { Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FileUpload, Layout } from "../../components";
import { setVideo } from "../../features/videos/videoSlice";
import { PublicRoutes } from "../../models";
import { validateVideoFile } from "../../utils";

function Upload() {
  const navigate = useNavigate();
  const uploadPage = useAppSelector(
    (state) => state.lang.pageLanguage.pages.upload
  );
  const dispatch = useAppDispatch();
  const handleFilesAdded = async (files: (File | null)[]) => {
    const file = await validateVideoFile(files[0]);
    if (file) {
      dispatch(setVideo(file));
      return navigate(`/${PublicRoutes.OPTIONS}`, { replace: true });
    }
    enqueueSnackbar("El archivo debe ser un video", {
      variant: "error",
    });
  };
  return (
    <Layout>
      <Box
        sx={{
          display: "grid",
          textAlign: "center",
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
          onFilesAdded={handleFilesAdded}
          title={uploadPage.title}
          subtitle={uploadPage.description}
          subbutton={uploadPage.dropText}
        >
          {uploadPage.uploadButton}
        </FileUpload>
      </Box>
    </Layout>
  );
}
export default Upload;
