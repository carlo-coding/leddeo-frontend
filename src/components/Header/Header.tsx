import { AppBar, Box, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
// import { ChoosePageLang } from "../ChoosePageLang";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../../models";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CButton } from "../CButton";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { toggleSidebar } from "../Sidebar/sidebarSlice/sidebarSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticaed = useAppSelector((state) => state.auth.isAuthenticated);

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
        onClick={() => navigate("/")}
      >
        LEDDEO
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
        {/* <ChoosePageLang /> */}

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
          <IconButton onClick={() => navigate(`/${PrivateRoutes.PRIVATE}`)}>
            <PersonIcon sx={{ color: "layout.white", fontSize: "30px" }} />
          </IconButton>
        ) : (
          <React.Fragment>
            <CButton onClick={() => navigate(`/${PublicRoutes.LOGIN}`)}>
              Iniciar sesión
            </CButton>
            <CButton onClick={() => navigate(`/${PublicRoutes.SIGNUP}`)}>
              Crear una cuenta
            </CButton>
          </React.Fragment>
        )}
      </Box>
    </AppBar>
  );
}
export default Header;
