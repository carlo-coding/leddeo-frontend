import { useMediaQuery, IconButton, Tooltip } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import LogoutIcon from "@mui/icons-material/Logout";
import { deleteCookie } from "../../utils";
import { PublicRoutes } from "../../models";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { motion } from "framer-motion";
import { useCustomPush } from "../../hooks";
import Backdrop from "@mui/material/Backdrop";
import { closeSidebar } from "./sidebarSlice/sidebarSlice";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

function Sidebar() {
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  const push = useCustomPush();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.sidebar.open);
  const isAuthenticaed = useAppSelector((state) => state.auth.isAuthenticated);

  const isMobile = useMediaQuery("(max-width:900px)");

  const handleClose = () => {
    dispatch(closeSidebar());
  };

  const handleLogout = () => {
    deleteCookie("access");
    deleteCookie("refresh");
    window.location.assign("/");
  };

  const sidebarComp = (
    <motion.nav
      animate={open || !isMobile ? "open" : "closed"}
      variants={variants}
      initial={open || !isMobile ? variants.open : variants.closed}
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
        boxShadow: "2px 2px 8px -2px rgba(0,0,0,0.5)",
      }}
    >
      <Tooltip title="Subir video">
        <IconButton
          onClick={() => {
            push(`/${PublicRoutes.UPLOAD}`);
          }}
        >
          <UploadIcon sx={{ color: "layout.black" }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Planes de pago">
        <IconButton
          onClick={() => {
            push(`/${PublicRoutes.PLANS}`);
          }}
        >
          <AttachMoneyIcon sx={{ color: "layout.black" }} />
        </IconButton>
      </Tooltip>

      {/* <IconButton>
        <MenuIcon sx={{ color: "layout.black" }} />
      </IconButton> */}

      <Tooltip title="Preguntas frecuentes">
        <IconButton
          onClick={() => {
            push(`/${PublicRoutes.FAQS}`);
          }}
        >
          <QuestionMarkIcon sx={{ color: "layout.black" }} />
        </IconButton>
      </Tooltip>

      {isAuthenticaed && (
        <Tooltip title="Cerrar sesión">
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
        </Tooltip>
      )}
    </motion.nav>
  );

  if (isMobile)
    return (
      <Backdrop
        open={open}
        onClick={handleClose}
        sx={{
          zIndex: 1050,
        }}
      >
        {sidebarComp}
      </Backdrop>
    );
  return sidebarComp;
}
export default Sidebar;
