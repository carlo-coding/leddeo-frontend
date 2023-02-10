import { Box, Button } from "@mui/material";
import { AnyAction } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CButton, Layout, Loading } from "../../components";
import { getVideoSubtitles } from "../../features";
import { PublicRoutes } from "../../models";
import { useEffect, useState } from "react";
import { IAsyncStatus } from "../../features/common";
import Typography from "@mui/material/Typography";

interface OptionProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  [s: string]: any;
}
function Option({ subtitle, title, children, ...props }: OptionProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "layout.mediumGray",
        gap: "15px",
        padding: "20px 30px",
        width: "400px",
        textAlign: "center",
        margin: "1em 0",
      }}
    >
      <Typography
        sx={{
          fontSize: "25px",
        }}
      >
        {title}
      </Typography>
      <Typography>{subtitle}</Typography>
      <Box
        sx={{
          height: "3px",
          width: "100%",
          backgroundColor: "layout.darkGray",
        }}
      ></Box>
      <CButton
        {...props}
        sx={{
          fontWeight: 600,
          padding: "1em 1.5em",
        }}
      >
        {children}
      </CButton>
    </Box>
  );
}

function Options() {
  const [calls, setCalls] = useState({
    manual: false,
    srt: false,
    automatic: false,
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const status = useAppSelector((state) => state.subtitle.status);
  const video = useAppSelector((state) => state.video.video);

  const manual = () => navigate(`/${PublicRoutes.EDITOR}`, { replace: true });
  const srt = () => navigate(`/${PublicRoutes.SRT_UPLOAD}`, { replace: true });

  const automatic = () => {
    if (video) dispatch(getVideoSubtitles(video));
    setCalls((prev) => ({ ...prev, automatic: true }));
  };

  useEffect(() => {
    if (status === IAsyncStatus.FULFILLED && calls.automatic) {
      navigate(`/${PublicRoutes.EDITOR}`, { replace: true });
    }
  }, [status, calls.automatic]);

  return (
    <Layout>
      {status === IAsyncStatus.PENDING && <Loading />}
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Option
          title="Subtitulado automático"
          subtitle="LEDEO hace los subtítulos por tí ¿Más fácil? imposible"
          onClick={automatic}
        >
          Continuar proyecto
        </Option>
        <Option
          title="Subir SRT"
          subtitle="Deja que LEDEO integre tu archivo SRT al vídeo"
          onClick={srt}
        >
          Continuar proyecto
        </Option>
        <Option
          title="Subtitulado manual"
          subtitle="Usa las herramientas que te ofrece LEDEO para un subtítulado de calidad"
          onClick={manual}
        >
          Continuar proyecto
        </Option>
      </Box>
    </Layout>
  );
}
export default Options;
