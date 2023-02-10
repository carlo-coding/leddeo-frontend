import { Layout } from "../../components";
import { Box } from "@mui/material";
import { PlanPanel } from "./subcomps";
import { plansData } from "./data";

/* function PricingPage() {
  // Paste the stripe-pricing-table snippet in your React component
  return (
    <stripe-pricing-table
      pricing-table-id="prctbl_1MVmBfBtx5BDXJ9wo1pbgj6x"
      publishable-key="pk_test_51MTT3cBtx5BDXJ9wu5NG74IzFBdRw6wzuVgHujSAJ2QF1YXSvxZL9b2U8liPxcVZEbblQhenu33DG3emevhGZwEd009sBpzmCk"
    ></stripe-pricing-table>
  );
} */

function Plans() {
  return (
    <Layout showFooter>
      <Box
        sx={{
          background: "white",
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 350px), 1fr))",
          gap: "15px",
          padding: "15px",
        }}
      >
        {plansData.map((d) => (
          <PlanPanel key={d.title} {...d} />
        ))}
      </Box>
    </Layout>
  );
}
export default Plans;
