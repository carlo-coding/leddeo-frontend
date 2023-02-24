import { Layout } from "../../components";
import { Box } from "@mui/material";
import { CustomPanel, PlanPanel } from "./subcomps";
import { plansData } from "./data";

function Plans() {
  return (
    <Layout showFooter>
      <Box
        sx={{
          background: "white",
          flexGrow: 1,
          display: "grid",
          placeItems: "center",
          gap: "15px",
          padding: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            padding: "2em 1em",
            borderRadius: "5px",
            boxShadow: "2px 2px 8px -2px rgba(0,0,0,0.5)",
          }}
        >
          <h2>Disfruta de todos los beneficios</h2>
          <CustomPanel />
        </Box>
      </Box>
    </Layout>
  );
}
export default Plans;
