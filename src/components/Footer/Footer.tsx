import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useAppSelector } from "../../app/hooks";

function Footer() {
  const footerComp = useAppSelector(
    (state) => state.lang.pageLanguage.pages.footer
  );
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
          {footerComp.terms}
        </a>
      </span>
      <span>
        {footerComp.contact}:
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
