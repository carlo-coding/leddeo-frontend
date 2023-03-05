import { Box, IconButton, useMediaQuery } from "@mui/material";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  CSlider,
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
import { downLoadFile, getVideoDuration, jsonToSrt } from "../../utils";
import {
  downloadCaptionVideo,
  getDownloadDuration,
  getFontsList,
  loadFonts,
} from "../../features";
import { IAsyncStatus } from "../../features/common";
import { EditionTabs } from "../Editor/subcomps";
import TranslateIcon from "@mui/icons-material/Translate";
import Forward5Icon from "@mui/icons-material/Forward5";
import Replay5Icon from "@mui/icons-material/Replay5";
export const firstRow = "76vh";

function Editor() {
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);

  const handleChangeVideoSpeed = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVideoSpeed(parseFloat(e.target.value));
  };

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

  const handleGoForward5Sec = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += 5;
    setCurrentTime(videoRef.current.currentTime);
  };
  const handleGoBackward5Sec = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime -= 5;
    setCurrentTime(videoRef.current.currentTime);
  };

  const dataSubtitles = useAppSelector((state) => state.subtitle.list);
  const brokenSubtitles = useAppSelector((state) => state.subtitle.broken);

  const url = useMemo(
    () => (video === null ? "" : URL.createObjectURL(video)),
    []
  );

  useEffect(() => {
    if (videoRef.current === null) return;
    dispatch(getFontsList());
    dispatch(loadFonts());

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

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = videoSpeed;
  }, [videoSpeed]);

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
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleRewindClick = () => {
    if (videoRef.current === null) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
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
          columnGap: "15px",
          rowGap: "5px",
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
                onTimeUpdate={handleTimeUpdate}
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
              <FastRewindIcon sx={{ fontSize: "1.2em", color: "#161616" }} />
            </IconButton>

            <IconButton onClick={handleGoBackward5Sec}>
              <Replay5Icon sx={{ fontSize: "1.2em", color: "#161616" }} />
            </IconButton>

            <IconButton onClick={togglePlay}>
              {isVideoPaused ? (
                <PlayCircleOutlineIcon
                  sx={{ fontSize: "1.2em", color: "#161616" }}
                />
              ) : (
                <PauseCircleOutlineIcon
                  sx={{ fontSize: "1.2em", color: "#161616" }}
                />
              )}
            </IconButton>

            <IconButton onClick={handleGoForward5Sec}>
              <Forward5Icon sx={{ fontSize: "1.2em", color: "#161616" }} />
            </IconButton>

            <IconButton onClick={handleForwardClick}>
              <FastForwardIcon sx={{ fontSize: "1.2em", color: "#161616" }} />
            </IconButton>

            <select value={videoSpeed} onChange={handleChangeVideoSpeed}>
              {[0.25, 0.5, 1.0, 1.25, 1.5, 2.0].map((o) => (
                <option key={o} value={o}>
                  x {o.toFixed(2)}
                </option>
              ))}
            </select>

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
          <CSlider
            max={(videoRef.current?.duration || 0) * 60}
            value={(currentTime || 0) * 60}
            onChange={(e: any, newValue: number) => {
              if (videoRef.current === null) return;
              videoRef.current.currentTime = newValue / 60;
              setCurrentTime(videoRef.current.currentTime);
            }}
          />
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
              playingBox: "#52af77",
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
            onClick={async () => {
              if (!video) return;
              const duration = await getVideoDuration(video);
              await dispatch(
                getDownloadDuration({
                  size: video.size,
                  duration,
                })
              );
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
