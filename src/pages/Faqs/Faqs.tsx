import Box from "@mui/material/Box";
import { CButton, Layout } from "../../components";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppSelector } from "../../app/hooks";
import React from "react";
import { useNavigate } from "react-router-dom";

function Faqs() {
  const faqs = useAppSelector((state) => state.faq.data);

  const navigate = useNavigate();

  return (
    <Layout showFooter>
      <Box
        sx={{
          background: "white",
          flexGrow: 1,
          display: "flex",
          placeItems: "center",
          justifyContent: "center",
          padding: "25px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "layout.lightGray",
            flexGrow: 1,
            width: "100%",
            height: "100%",
            padding: "25px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "1em 0",
            }}
          >
            <h2>Preguntas frecuentes</h2>
            <CButton onClick={() => navigate("/")}>Empezar proyecto</CButton>
          </Box>
          {faqs.map((faq) => (
            <Accordion key={faq.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id={`panel${faq.id}a-header`}
              >
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                ></Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Layout>
  );
}
export default Faqs;
