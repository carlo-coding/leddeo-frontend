import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";

function Footer() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        color: "layout.mediumGray",
        gap: "1em",
        padding: "1em",
        "& a": {
          color: "layout.white",
        },
      }}
    >
      <span>Leddeo</span>
      <span>
        <a target="_blank" href="/terms">
          Terminos y condiciones
        </a>
      </span>
      <span>
        <a target="_blank" href="/policies">
          Políticas de privacidad
        </a>
      </span>
      <span>
        Contactanos:
        <a href="mailto:support@leddeo.com"> support@leddeo.com</a>
      </span>
      <IconButton>
        <a target="_blank" href="https://www.linkedin.com/company/leddeo">
          <LinkedInIcon />
        </a>
      </IconButton>
      {/* <IconButton>
        <a target="_blank" href="">
          <FacebookIcon />
        </a>
      </IconButton> */}
      <IconButton>
        <a target="_blank" href="https://www.youtube.com/@leddeo">
          <YouTubeIcon />
        </a>
      </IconButton>
    </Box>
  );
}
export default Footer;
