import { Box, CircularProgress } from "@mui/material";

function Loading(): JSX.Element {
  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        flexGrow: 1,
        minWidth: "100vw",
        minHeight: "100vh",
        position: "fixed",
        zIndex: "9999",
        backgroundColor: "#222",
        inset: 0,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
export default Loading;
