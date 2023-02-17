import { Box, IconButton, useMediaQuery } from "@mui/material";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  Layout,
  Loading,
  openModal,
  SelectLanguage,
  setModalContent,
  Subtitles,
  UserConfirm,
} from "../../components";
import Timeline from "../../components/Timeline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { setSubtitleList } from "../../features/subtitle/subtitleSlice";
import { downLoadFile, jsonToSrt } from "../../utils";
import { downloadCaptionVideo } from "../../features";
import { IAsyncStatus } from "../../features/common";
import { EditionTabs } from "../Editor/subcomps";
import TranslateIcon from "@mui/icons-material/Translate";

export const firstRow = "76vh";

function Editor() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const dispatch = useAppDispatch();

  const editor = useAppSelector(
    (state) => state.lang.pageLanguage.pages.editor
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const video = useAppSelector((state) => state.video.video);
  const style = useAppSelector((state) => state.subtitle.style);
  const status = useAppSelector((state) => state.subtitle.status);

  const dataSubtitles = useAppSelector((state) => state.subtitle.list);
  const brokenSubtitles = useAppSelector((state) => state.subtitle.broken);
  const url = useMemo(
    () => (video === null ? "" : URL.createObjectURL(video)),
    []
  );

  useEffect(() => {
    if (videoRef.current === null) return;
    const handleEnd = () => setIsVideoPaused(true);
    const handlePlay = () => setIsVideoPaused(false);
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = "Aún no has guardado tu progreso";
    };
    videoRef.current.addEventListener("ended", handleEnd);
    videoRef.current.addEventListener("play", handlePlay);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      videoRef.current?.removeEventListener("ended", handleEnd);
      videoRef.current?.removeEventListener("play", handlePlay);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const togglePlay = () => {
    setIsVideoPaused(!Boolean(videoRef.current?.paused));
    if (videoRef.current?.paused) {
      videoRef.current.play();
      return;
    }
    videoRef.current?.pause();
  };
  const pauseVideo = () => {
    videoRef.current?.pause();
  };

  const handleForwardClick = () => {
    if (videoRef.current === null) return;
    videoRef.current.currentTime = videoRef.current.duration;
  };

  const handleRewindClick = () => {
    if (videoRef.current === null) return;
    videoRef.current.currentTime = 0;
  };

  const handleSubtitlesTranslate = () => {
    const cb = () => {
      dispatch(setModalContent(<SelectLanguage />));
      dispatch(openModal());
    };

    dispatch(
      setModalContent(
        <UserConfirm cb={cb}>
          Al traducir se perderá el contenido original, te recomendamos
          descargar tu progreso
        </UserConfirm>
      )
    );
    dispatch(openModal());
  };

  return (
    <Layout>
      {status === IAsyncStatus.PENDING && <Loading />}
      <Box
        sx={{
          display: "grid",
          width: "100%",
          height: "100%",
          gridTemplateColumns: {
            md: "3fr 1fr",
            xs: "1fr",
          },
          gridTemplateRows: {
            md: `${firstRow} 1fr`,
            xs: `auto ${firstRow} auto`,
          },
          alignItems: "center",
          "& *": {
            userSelect: "none",
          },
          padding: "30px",
          gap: "15px",
          backgroundColor: "layout.white",
          fontSize: "max(38px, 3vmax)",
        }}
      >
        {/* AUDIO CONTAINER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: firstRow,
              backgroundColor: "layout.darkGray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Subtitles data={dataSubtitles} videoRef={videoRef}>
              <Box
                component="video"
                src={url}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  backgroundColor: "#393939",
                  margin: "auto",
                  position: "absolute",
                }}
                ref={videoRef}
              />
            </Subtitles>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              width: "100%",
              position: "relative",
              borderBottom: "1px solid",
            }}
          >
            <IconButton onClick={handleRewindClick}>
              <FastRewindIcon sx={{ fontSize: "1.5em", color: "#161616" }} />
            </IconButton>

            <IconButton onClick={togglePlay}>
              {isVideoPaused ? (
                <PlayCircleOutlineIcon
                  sx={{ fontSize: "1.5em", color: "#161616" }}
                />
              ) : (
                <PauseCircleOutlineIcon
                  sx={{ fontSize: "1.5em", color: "#161616" }}
                />
              )}
            </IconButton>

            <IconButton onClick={handleForwardClick}>
              <FastForwardIcon sx={{ fontSize: "1.5em", color: "#161616" }} />
            </IconButton>

            <Box
              component="button"
              onClick={handleSubtitlesTranslate}
              sx={{
                position: "absolute",
                right: "10px",
                fontSize: "0.3em",
                borderColor: {
                  md: "layout.darkGray",
                  xs: "transparent",
                },
                border: "1px solid",
                padding: "0.6em 1.6em",
                color: "layout.darkGray",
                backgroundColor: "layout.white",
              }}
            >
              {isMobile ? <TranslateIcon /> : editor.translateButton}
            </Box>
          </Box>
        </Box>

        {/* SUBTITLES EDITOR */}
        <EditionTabs />

        {/* TIMELINE */}
        <Box
          sx={{
            gridRow: {
              md: "none",
              xs: "3 / 4",
            },
          }}
        >
          <Timeline
            setAligns={(a) => {
              dispatch(setSubtitleList(a));
            }}
            paddingLeft="10px"
            audioRef={videoRef}
            data={dataSubtitles}
            autoScroll
            colors={{
              background: "#161616",
              box: "#FFF",
              boxHover: "#c2c9d6",
              selectedBox: "#c2c9d6",
              playingBox: "#222",
              text: "#212b33",
              selectedText: "white",
              tooltipBackground: "#474e54",
              tooltipText: "white",
              scrollBarBackground: "#f1f3f9",
              scrollBar: "#222",
              scrollBarHover: "#5e636e",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            align: "center",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            gridRow: {
              md: "none",
              xs: "1 / 2",
            },
            "& > *": {
              backgroundColor: "layout.veryDarkGray",
              color: "layout.white",
              padding: "0.9em 0.3em",
              fontSize: "0.35em",
              flex: 1,
            },
          }}
        >
          <Box
            component="button"
            onClick={() => {
              if (!video) return;
              dispatch(
                downloadCaptionVideo({
                  file: video,
                  srt: jsonToSrt(brokenSubtitles),
                  style: style,
                })
              );
              pauseVideo();
            }}
          >
            {editor.downloadVideo}
          </Box>

          <Box
            component="button"
            onClick={() => {
              downLoadFile(jsonToSrt(dataSubtitles), "subtitles.srt");
            }}
          >
            {editor.downloadSrt}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
export default memo(Editor);
