import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  CButton,
  CountdownTimer,
  EditUserInfo,
  Layout,
  openModal,
  setModalContent,
} from "../../components";
import { getHistory } from "../../features";
import { portalSession } from "../../features/checkout/checkoutActions";
import { HistoryActions, PrivateRoutes } from "../../models";
import { useEffect } from "react";

function Profile() {
  const user = useAppSelector((state) => state.user.data);
  const history = useAppSelector((state) => state.history.data);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const profilePage = useAppSelector(
    (state) => state.lang.pageLanguage.pages.profile
  );

  const numberOfSubtitlesTranslated = history.reduce((acc, curr) => {
    if (curr.action === HistoryActions.SUBTITLE_TRANSLATE) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const numberOfDownloadedVideos = history.reduce((acc, curr) => {
    if (curr.action === HistoryActions.VIDEO_CAPTION) {
      return acc + 1;
    }
    return acc;
  }, 0);

  useEffect(() => {
    dispatch(getHistory());
  }, []);

  const handleOpenEdit = () => {
    dispatch(setModalContent(<EditUserInfo />));
    dispatch(openModal());
  };

  const handleOpenPortal = () => {
    dispatch(portalSession({ customer_id: user?.info.customer_id }));
  };

  return (
    <Layout>
      <Box
        sx={{
          fontSize: {
            md: "16px",
            xs: "12px",
          },
          background: "white",
          flexGrow: 1,
          display: "flex",
          placeItems: "center",
          justifyContent: "center",
          padding: "1.6em",
        }}
      >
        <Box
          sx={{
            backgroundColor: "layout.lightGray",
            flexGrow: 1,
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: {
              md: "3fr 2fr",
              xs: "1fr",
            },
            gridTemplateRows: {
              md: "50px 2fr 1fr",
              xs: "auto",
            },
            alignItems: "center",
            gap: "1.7em",
            padding: "1.7em",
            "& >*": {
              display: "grid",
              alignItems: "center",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "1.7em",
            }}
          >
            {profilePage.title}
          </Typography>
          <CButton
            sx={{
              marginLeft: "auto",
              padding: "0.7em 2.8em",
            }}
            onClick={handleOpenEdit}
          >
            {profilePage.editButton}
          </CButton>
          {/* Profile box */}
          <Box
            sx={{
              backgroundColor: "layout.white",
              flexGrow: 1,
              width: "100%",
              height: "100%",
              display: "grid",
              padding: "0.9em",
              gap: "0.7em",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.5em",
              }}
            >
              {user?.username}
            </Typography>
            <h2>{profilePage.platformStatus}</h2>
            {/* <Typography
              sx={{
                fontSize: "2em",
                fontStyle: "italic",
              }}
            >
              {user?.plans?.[0]?.current_period_end && (
                <CountdownTimer date={user?.plans[0].current_period_end} />
              )}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.9em",
              }}
            >
              Tiempo restante del plan
            </Typography>
            <Box
              sx={{
                height: "2px",
                backgroundColor: "layout.lightGray",
                width: "100%",
              }}
            ></Box>
            <Typography
              sx={{
                fontSize: "1.7em",
              }}
            >
              Plan actual:
            </Typography>
            <Typography
              sx={{
                fontSize: "1.4em",
              }}
            >
              {user?.plans?.[0]?.name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: "0.9em",
                alignSelf: "center",
                flexWrap: "wrap",
              }}
            >
              <CButton c="layout.navyBlue" onClick={handleOpenPortal}>
                Mejorar plan
              </CButton>
              <CButton c="layout.navyBlue" onClick={handleOpenPortal}>
                Renovar plan
              </CButton>
              <CButton
                c="layout.darkRed"
                sx={{
                  marginLeft: {
                    md: "auto",
                    xs: 0,
                  },
                }}
                onClick={handleOpenPortal}
              >
                Cancelar cuenta
              </CButton>
            </Box> */}
          </Box>
          {/* End Profile box */}
          <Box
            sx={{
              backgroundColor: "layout.white",
              width: "100%",
              height: "100%",
              padding: "0.9em",
            }}
          >
            <Typography sx={{ fontSize: "1.4em" }}>
              {profilePage.historySubtitlesTranslated}
            </Typography>
            <Typography sx={{ fontSize: "2.1em" }}>
              {numberOfSubtitlesTranslated}
            </Typography>
            <Typography sx={{ fontSize: "1.4em" }}>
              {profilePage.historyVideosDownloaded}
            </Typography>
            <Typography sx={{ fontSize: "2.1em" }}>
              {numberOfDownloadedVideos}
            </Typography>
            <CButton
              c="layout.navyBlue"
              sx={{ marginRight: "auto" }}
              onClick={() => {
                navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.HISTORY}`);
              }}
            >
              {profilePage.historyButton}
            </CButton>
          </Box>
          <div></div>
          <Box
            sx={{
              backgroundColor: "layout.white",
              width: "100%",
              height: "100%",
              padding: "0.9em",
            }}
          >
            <Typography>{profilePage.supportQuestion}</Typography>
            <Box
              sx={{
                padding: "0.6em 0.9em",
                backgroundColor: "layout.darkGray",
                color: "layout.white",
                "& a": {
                  color: "layout.white",
                },
              }}
            >
              {profilePage.supportMessage}{" "}
              <a href="mailto:support@leddeo.com">support@leddeo.com</a>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
export default Profile;
