import { AppBar, Box, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { ChoosePageLang } from "../ChoosePageLang";
import { PrivateRoutes, PublicRoutes } from "../../models";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CButton } from "../CButton";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { toggleSidebar } from "../Sidebar/sidebarSlice/sidebarSlice";
import { useCustomPush } from "../../hooks";
import { useMediaQuery } from "@mui/material";

function Header() {
  const push = useCustomPush();
  const dispatch = useAppDispatch();
  const isAuthenticaed = useAppSelector((state) => state.auth.isAuthenticated);
  const isMobile = useMediaQuery("(max-width:900px)");
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "layout.veryDarkGray",
      }}
    >
      <Box
        component="button"
        sx={{
          typography: "logo",
          padding: "0",
        }}
        onClick={() => push("/")}
      >
        {isMobile ? "" : "LEDDEO"}
      </Box>

      <Box
        sx={{
          marginLeft: "auto",
          marginRight: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <ChoosePageLang />

        <IconButton
          onClick={handleToggleSidebar}
          sx={{
            display: {
              md: "none",
              xs: "flex",
            },
          }}
        >
          <MenuIcon sx={{ color: "layout.white" }} />
        </IconButton>

        {isAuthenticaed ? (
          <IconButton onClick={() => push(`/${PrivateRoutes.PRIVATE}`)}>
            <PersonIcon sx={{ color: "layout.white", fontSize: "30px" }} />
          </IconButton>
        ) : (
          <React.Fragment>
            <CButton onClick={() => push(`/${PublicRoutes.LOGIN}`)}>
              Iniciar sesión
            </CButton>
            <CButton onClick={() => push(`/${PublicRoutes.SIGNUP}`)}>
              Crear una cuenta
            </CButton>
          </React.Fragment>
        )}
      </Box>
    </AppBar>
  );
}
export default Header;
