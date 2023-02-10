import { Box, Typography, useMediaQuery } from "@mui/material";
import { CButton, Footer, Layout } from "../../components";
import homepagePicture from "../../assets/homepage-picture.png";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "../../models";

function Landing() {
  const isMobile = useMediaQuery("(max-width:900px)");

  const contPadding = isMobile ? 15 : 25;
  const mainLineHeight = 100;
  const mainLineTop = isMobile ? 300 : 100;
  const childContLineHeight = mainLineTop - contPadding;

  const navigate = useNavigate();

  return (
    <Layout showFooter>
      <Box
        sx={{
          backgroundImage: `linear-gradient(to bottom, 
            #ffffff, 
            #ffffff ${mainLineTop}px, 
            #161616 ${mainLineTop}px, 
            #161616 ${mainLineHeight + mainLineTop}px, 
            #ffffff ${mainLineHeight + mainLineTop}px
          )`,
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
          padding: `${contPadding}px`,
        }}
      >
        <Box
          sx={{
            backgroundImage: `linear-gradient(to bottom, 
              #F4F4F4, 
              #F4F4F4 ${childContLineHeight}px, 
              #161616 ${childContLineHeight}px, 
              #161616 ${mainLineHeight + childContLineHeight}px, 
              #F4F4F4 ${mainLineHeight + childContLineHeight}px
            )`,
            flexGrow: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            padding: {
              md: `${childContLineHeight}px 1.5em`,
              xs: `${childContLineHeight}px 1.5em 0`,
            },
            gap: "10px",
            "& >*": {
              width: "100%",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              maxHeight: {
                md: "500px",
                xs: "300px",
              },
              ...(isMobile && {
                position: "absolute",
                top: "70px",
                left: 0,
                padding: `${contPadding * 1.5}px`,
                gap: "30px",
              }),
            }}
          >
            <Typography
              sx={{
                color: "layout.white",
                fontWeight: 700,
                fontSize: "70px",
                fontStyle: "italic",
                ...(isMobile && {
                  display: "none",
                }),
              }}
            >
              LEDDEO
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  md: "max(37px, 6vh)",
                  xs: "25px",
                },
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              PONLO EN PALABRAS
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  md: "max(18px, 3vh)",
                  xs: "15px",
                },
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              Gracias a nuestra poderosa tecnología, puedes dejarle todo el
              trabajo duro a LEDDEO. ¡La manera más rápida y fácil de
              subtitular!
            </Typography>
            <Box
              sx={{
                fontSize: {
                  md: "max(16px, 2.5vh)",
                  xs: "14px",
                },
                display: "flex",
                gap: "1em",
              }}
            >
              <CButton
                onClick={() => navigate(`/${PublicRoutes.UPLOAD}`)}
                sx={{
                  backgroundColor: "layout.veryDarkGray",
                  padding: "0.6em 2.4em",
                }}
              >
                Pruébalo ahora
              </CButton>
              {/* <CButton
                onClick={() => navigate(`/${PublicRoutes.PLANS}`)}
                sx={{
                  backgroundColor: "layout.veryDarkGray",
                  padding: "0.6em 2.4em",
                }}
              >
                Ver precios
              </CButton> */}
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "layout.veryDarkGray",
              boxShadow: "5px 5px 16px -4px rgba(0,0,0,0.79)",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              maxHeight: {
                md: "500px",
                xs: "300px",
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "8px",
                overflow: "hidden",
                ...(isMobile && {
                  minHeight: "230px",
                }),
                "& img": {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  objectFit: "cover",
                  objectPosition: "center -40px",
                  inset: 0,
                },
              }}
            >
              <img src={homepagePicture} alt="homepagePicture" />
            </Box>
            <Box
              sx={{
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <FastRewindIcon
                sx={{ fontSize: "35px", color: "layout.white" }}
              />

              <PlayCircleOutlineIcon
                sx={{ fontSize: "35px", color: "layout.white" }}
              />

              <FastForwardIcon
                sx={{ fontSize: "35px", color: "layout.white" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
export default Landing;
