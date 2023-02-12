import { Box, IconButton, Button, Tabs, Tab } from "@mui/material";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  Layout,
  Loading,
  openModal,
  SelectLanguage,
  setModalContent,
  SubtitleEditor,
  Subtitles,
} from "../../components";
import Timeline from "../../components/Timeline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { setSubtitleList } from "../../features/subtitle/subtitleSlice";
import { downLoadFile, jsonToSrt, srtToArray } from "../../utils";
import { downloadCaptionVideo } from "../../features";
import { IAsyncStatus } from "../../features/common";
import { EditionTabs } from "../Editor/subcomps";

function Editor() {
  const dispatch = useAppDispatch();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const video = useAppSelector((state) => state.video.video);
  const style = useAppSelector((state) => state.subtitle.style);
  const status = useAppSelector((state) => state.subtitle.status);

  // const dataSubtitles = useAppSelector((state) => state.subtitle.list);
  /* const url = useMemo(
    () => (video === null ? "" : URL.createObjectURL(video)),
    []
  ); */

  // TEST
  const url = "/nodata/original.mp4";
  const [dataSubtitles, setDataSubtitles] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const resp = await fetch("/nodata/subtitles_original.srt");
      const text = await resp.text();
      setDataSubtitles(srtToArray(text));
    })();
  }, []);
  // TEST

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

  const handleVideoPlay = () => {
    setIsVideoPaused(!Boolean(videoRef.current?.paused));
    if (videoRef.current?.paused) {
      videoRef.current.play();
      return;
    }
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

  return (
    <Layout>
      {status === IAsyncStatus.PENDING && <Loading />}
      <Box
        sx={{
          display: "grid",
          width: "100%",
          height: "100%",
          gridTemplateColumns: "3fr 1fr",
          gridTemplateRows: "76vh 1fr",
          alignItems: "center",
          "& *": {
            userSelect: "none",
          },
          padding: "30px",
          gap: "15px",
          backgroundColor: "layout.white",
          fontSize: "max(16px, 3vmax)",
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
              height: "76vh",
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
                  backgroundColor: "black",
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

            <IconButton onClick={handleVideoPlay}>
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
              onClick={() => {
                dispatch(setModalContent(<SelectLanguage />));
                dispatch(openModal());
              }}
              sx={{
                position: "absolute",
                right: "10px",
                fontSize: "0.3em",
                borderColor: "layout.darkGray",
                border: "1px solid",
                padding: "0.6em 1.6em",
                color: "layout.darkGray",
                backgroundColor: "layout.white",
              }}
            >
              TRADUCIR SUBTÍTULOS
            </Box>
          </Box>
        </Box>

        {/* SUBTITLES EDITOR */}
        <EditionTabs />

        {/* TIMELINE */}
        <Timeline
          setAligns={(a) => {
            dispatch(setSubtitleList(a));
          }}
          paddingLeft=""
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

        <Box
          sx={{
            display: "flex",
            align: "center",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
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
                  srt: jsonToSrt(dataSubtitles),
                  style: style,
                })
              );
            }}
          >
            Descargar video
          </Box>

          <Box
            component="button"
            onClick={() => {
              downLoadFile(jsonToSrt(dataSubtitles), "subtitles.srt");
            }}
          >
            Descargar SRT
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
export default memo(Editor);

/* 

import { Box, IconButton, Button, Tabs, Tab } from "@mui/material";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  CButton,
  Layout,
  Loading,
  openModal,
  SelectLanguage,
  setModalContent,
  SubtitleEditor,
  Subtitles,
} from "../../components";
import Timeline from "../../components/Timeline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { setSubtitleList } from "../../features/subtitle/subtitleSlice";
import { downLoadFile, jsonToSrt, srtToArray } from "../../utils";
import { IAsyncStatus } from "../../features/common";
import { EditionTabs } from "../Editor/subcomps";

function Editor() {
  const dispatch = useAppDispatch();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(true);

  useEffect(() => {
    (async () => {
      const resp = await fetch("/data/subtitles_original.srt");
      const text = await resp.text();
      setDataSubtitles(srtToArray(text));
    })();
  }, []);

  const status = useAppSelector((state) => state.subtitle.status);

  const url = "/data/original.mp4";

  useEffect(() => {
    if (videoRef.current === null) return;
    const handleEnd = () => setIsVideoPaused(true);
    const handlePlay = () => setIsVideoPaused(false);
    videoRef.current.addEventListener("ended", handleEnd);
    videoRef.current.addEventListener("play", handlePlay);
    return () => {
      videoRef.current?.removeEventListener("ended", handleEnd);
      videoRef.current?.removeEventListener("play", handlePlay);
    };
  }, []);

  const handleVideoPlay = () => {
    setIsVideoPaused(!Boolean(videoRef.current?.paused));
    if (videoRef.current?.paused) {
      videoRef.current.play();
      return;
    }
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

  return (
    <Layout>
      {status === IAsyncStatus.PENDING && <Loading />}
      <Box
        sx={{
          display: "grid",
          width: "100%",
          height: "100%",
          gridTemplateColumns: "3fr 1fr",
          gridTemplateRows: "450px 1fr",
          alignItems: "center",
          "& *": {
            userSelect: "none",
          },
          padding: "30px",
          gap: "15px",
          backgroundColor: "layout.white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Subtitles data={dataSubtitles} videoRef={videoRef}>
            <Box
              component="video"
              src={url}
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
              ref={videoRef}
            />
          </Subtitles>
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
              <FastRewindIcon sx={{ fontSize: "35px", color: "#161616" }} />
            </IconButton>

            <IconButton onClick={handleVideoPlay}>
              {isVideoPaused ? (
                <PlayCircleOutlineIcon
                  sx={{ fontSize: "35px", color: "#161616" }}
                />
              ) : (
                <PauseCircleOutlineIcon
                  sx={{ fontSize: "35px", color: "#161616" }}
                />
              )}
            </IconButton>

            <IconButton onClick={handleForwardClick}>
              <FastForwardIcon sx={{ fontSize: "35px", color: "#161616" }} />
            </IconButton>

            <Box
              component="button"
              onClick={() => {
                dispatch(setModalContent(<SelectLanguage />));
                dispatch(openModal());
              }}
              sx={{
                position: "absolute",
                right: "10px",
                fontSize: "12px",
                borderColor: "layout.darkGray",
                border: "1px solid",
                padding: "0.6em 1.6em",
                color: "layout.darkGray",
                backgroundColor: "layout.white",
              }}
            >
              TRADUCIR SUBTÍTULOS
            </Box>
          </Box>
        </Box>

        <EditionTabs />

        <Timeline
          setAligns={(a) => {
            dispatch(setSubtitleList(a));
          }}
          paddingLeft=""
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

        <Box
          sx={{
            display: "flex",
            align: "center",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            "& > *": {
              backgroundColor: "layout.veryDarkGray",
              color: "layout.white",
              padding: "12px 16px",
              fontSize: "12px",
              flex: 1,
            },
          }}
        >
          <Box component="button">Descargar video</Box>

          <Box
            component="button"
            onClick={() => {
              downLoadFile(jsonToSrt(dataSubtitles), "subtitles.srt");
            }}
          >
            Descargar SRT
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
export default memo(Editor);
*/
