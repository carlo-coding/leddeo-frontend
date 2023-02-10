import { Box } from "@mui/material";
import { Layout } from "../Layout";
import starsImage from "../../assets/stars.jpg";

function NotFound(): JSX.Element {
  return (
    <Layout>
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          flexGrow: 1,
          backgroundColor: "layout.lightGray",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="h1"
            sx={{
              backgroundImage: `url(${starsImage})`,
              backgroundSize: "cover",
              fontSize: "15vw",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            404
          </Box>
          <Box component="h2">Página no encontrada</Box>
        </Box>
      </Box>
    </Layout>
  );
}
export default NotFound;
