import { Box } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { getFaqs, getUser } from "../../features";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { Modal } from "../Modal";
import Sidebar from "../Sidebar/Sidebar";
interface TLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

function Layout({ children, showFooter = false }: TLayoutProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getFaqs());
  }, []);

  return (
    <Box
      sx={{
        minHeight: showFooter ? `calc(100vh + 77px)` : "100vh",
        display: "flex",
        flexDirection: "column",
        color: "layout.black",
        paddingTop: "60px",
        paddingLeft: {
          md: "60px",
          xm: "0",
        },
      }}
    >
      <Header />
      <Sidebar />
      <Modal />
      {children}
      {showFooter && <Footer />}
    </Box>
  );
}
export default Layout;
