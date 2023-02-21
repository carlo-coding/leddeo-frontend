import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Layout, CButton } from "../../components";
import { PublicRoutes } from "../../models";

function Verified() {
  const navigate = useNavigate();

  return (
    <Layout showFooter>
      <Box
        sx={{
          background: "white",
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "15px",
        }}
      >
        <Box
          sx={{
            width: "min(450px, 85vw)",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "20px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "2px 2px 8px -2px rgba(0,0,0,0.5)",
          }}
        >
          <h3>
            Gracias por verificar tu correo, ahora puedes disfutar de más
            beneficios comprando un plan
          </h3>
          <CButton onClick={() => navigate(`/${PublicRoutes.PLANS}`)}>
            Ver planes
          </CButton>
        </Box>
      </Box>
    </Layout>
  );
}
export default Verified;
