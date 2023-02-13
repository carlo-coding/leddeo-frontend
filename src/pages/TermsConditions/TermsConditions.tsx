import { Layout } from "../../components";
import { Box } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
function TermsConditions() {
  const template = useAppSelector((state) => state.acceptance.latest?.template);
  return (
    <Layout showFooter>
      <Box
        sx={{
          color: "layout.white",
          width: "100%",
          height: "100%",
          padding: "1em",
        }}
      >
        {template && <Box dangerouslySetInnerHTML={{ __html: template }}></Box>}
      </Box>
    </Layout>
  );
}
export default TermsConditions;
