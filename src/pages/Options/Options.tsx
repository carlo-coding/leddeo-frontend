import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CButton, Layout, Loading } from "../../components";
import { getTranscripDuration, getVideoSubtitles } from "../../features";
import { PublicRoutes } from "../../models";
import { useEffect, useState } from "react";
import { IAsyncStatus } from "../../features/common";
import Typography from "@mui/material/Typography";
import { getVideoDuration, validateUserPlans } from "../../utils";

interface OptionProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  helpText?: string;
  [s: string]: any;
}
function Option({
  subtitle,
  title,
  children,
  helpText,
  ...props
}: OptionProps) {
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
        position: "relative",
      }}
    >
      {helpText && (
        <Typography
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "translateY(-50%)",
            color: "white",
            backgroundColor: "layout.navyBlue",
            padding: "0 0.4em",
          }}
        >
          {helpText}
        </Typography>
      )}
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
        disabled={!!helpText}
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
  const optionsPage = useAppSelector(
    (state) => state.lang.pageLanguage.pages.options
  );

  const user = useAppSelector((state) => state.user.data);
  const userPlanIsValid = validateUserPlans(user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const status = useAppSelector((state) => state.subtitle.status);
  const video = useAppSelector((state) => state.video.video);

  const manual = () => navigate(`/${PublicRoutes.EDITOR}`, { replace: true });
  const srt = () => navigate(`/${PublicRoutes.SRT_UPLOAD}`, { replace: true });

  const automatic = async () => {
    if (video) {
      const duration = await getVideoDuration(video);
      await dispatch(
        getTranscripDuration({
          size: video.size,
          duration,
        })
      );
      dispatch(getVideoSubtitles(video));
    }
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
          title={optionsPage.titleAutomatic}
          subtitle={optionsPage.subtitleAutomatic}
          onClick={automatic}
          helpText={userPlanIsValid ? undefined : "You need a plan"}
        >
          {optionsPage.startButtonAutomatic}
        </Option>
        <Option
          title={optionsPage.titleSrtUpload}
          subtitle={optionsPage.subtitleSrtUpload}
          onClick={srt}
        >
          {optionsPage.startButtonSrtUpload}
        </Option>
        <Option
          title={optionsPage.titleManual}
          subtitle={optionsPage.subtitleManual}
          onClick={manual}
        >
          {optionsPage.startButtonManual}
        </Option>
      </Box>
    </Layout>
  );
}
export default Options;
