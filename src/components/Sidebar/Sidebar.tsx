import { useMediaQuery, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import LogoutIcon from "@mui/icons-material/Logout";
import { deleteCookie } from "../../utils";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "../../models";
import { useAppSelector } from "../../app/hooks";
import { motion } from "framer-motion";

function Sidebar() {
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  const navigate = useNavigate();

  const open = useAppSelector((state) => state.sidebar.open);
  const isAuthenticaed = useAppSelector((state) => state.auth.isAuthenticated);

  const isMobile = useMediaQuery("(max-width:900px)");

  const handleLogout = () => {
    deleteCookie("access");
    deleteCookie("refresh");
    window.location.assign("/");
  };

  return (
    <motion.nav
      animate={open || !isMobile ? "open" : "closed"}
      variants={variants}
      initial={variants.closed}
      style={{
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        alignItems: "center",
        width: "60px",
        position: "fixed",
        paddingTop: "80px",
        left: 0,
        bottom: 0,
        top: 0,
        zIndex: 500,
      }}
    >
      <IconButton
        onClick={() => {
          navigate(`/`);
        }}
      >
        <HomeIcon sx={{ color: "layout.black" }} />
      </IconButton>

      {/* <IconButton
        onClick={() => {
          navigate(`/${PublicRoutes.PLANS}`);
        }}
      >
        <AttachMoneyIcon sx={{ color: "layout.black" }} />
      </IconButton> */}

      {/* <IconButton>
        <MenuIcon sx={{ color: "layout.black" }} />
      </IconButton> */}

      <IconButton
        onClick={() => {
          navigate(`/${PublicRoutes.FAQS}`);
        }}
      >
        <QuestionMarkIcon sx={{ color: "layout.black" }} />
      </IconButton>

      {isAuthenticaed && (
        <IconButton
          onClick={handleLogout}
          sx={{
            marginTop: "auto",
            marginBottom: "1em",
            color: "layout.black",
          }}
        >
          <LogoutIcon />
        </IconButton>
      )}
    </motion.nav>
  );
}
export default Sidebar;
