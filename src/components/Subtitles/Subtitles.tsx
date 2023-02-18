import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setCurrentSubtitleId,
  updateBrokenSubtitleList,
} from "../../features/subtitle/subtitleSlice";
import { TSubtitleItem } from "../../models/responses";
import { linesFromTextNode } from "../../utils";

interface TSubtitlesProps {
  data: TSubtitleItem[];
  children?: React.ReactNode;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

function Subtitles({ videoRef, children }: TSubtitlesProps) {
  const subtitlesRef = useRef<HTMLParagraphElement | null>(null);
  const containerRef = useRef<HTMLParagraphElement | null>(null);

  const dispatch = useAppDispatch();

  const style = useAppSelector((state) => state.subtitle.style);

  const subtitles = useAppSelector((state) => state.subtitle.list);

  const handleTimeUpdate = () => {
    if (videoRef.current === null || subtitlesRef.current === null) return;
    const currt = videoRef.current.currentTime;
    const subtitle = subtitles.find((subt) => {
      return currt >= subt.begin && currt < subt.end;
    });
    if (!subtitle) {
      subtitlesRef.current.textContent = "";
      return;
    }
    dispatch(setCurrentSubtitleId(subtitle.id));
    subtitlesRef.current.textContent =
      typeof subtitle?.text === "string" ? subtitle.text : null;
    const el = document.querySelector(".subtitle")?.firstChild;
    if (el)
      dispatch(
        updateBrokenSubtitleList({
          ...subtitle,
          text: linesFromTextNode(el).join("\n"),
        })
      );
  };

  useEffect(() => {
    if (videoRef.current === null || subtitlesRef.current === null) return;
    const originalText =
      subtitlesRef.current.textContent || subtitles[0].text || "";
    for (let subtitle of subtitles) {
      subtitlesRef.current.textContent =
        typeof subtitle?.text === "string" ? subtitle.text : null;
      const el = document.querySelector(".subtitle")?.firstChild;
      if (el)
        dispatch(
          updateBrokenSubtitleList({
            ...subtitle,
            text: linesFromTextNode(el).join("\n"),
          })
        );
    }
    subtitlesRef.current.textContent = originalText;
  }, [videoRef.current, subtitlesRef.current, subtitles]);

  useEffect(() => {
    if (videoRef.current === null) return;
    videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef.current, subtitles]);

  const width =
    ((videoRef.current?.videoWidth || 0) /
      (videoRef.current?.videoHeight || 1)) *
    (containerRef.current?.clientHeight || 1);

  const flexDirections = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  return (
    <Box
      sx={{
        width: width < 3 ? "100%" : `${width}px`,
        height: "100%",
        position: "relative",
        backgroundColor: "layout.mediumGray",
      }}
      ref={containerRef}
    >
      {children}
      <Box
        sx={{
          position: "absolute",
          width: "80%",
          display: "flex",
          justifyContent:
            flexDirections[style.hAlign as keyof typeof flexDirections],
          textAlign: style.hAlign,
          bottom:
            { bottom: "10%", top: "auto", center: "50%" }[style.vAlign] ||
            "auto",
          top:
            { bottom: "auto", top: "10%", center: "auto" }[style.vAlign] ||
            "auto",
          left:
            { left: "10%", right: "auto", center: "50%" }[style.hAlign] ||
            "auto",
          right:
            { left: "auto", right: "10%", center: "auto" }[style.hAlign] ||
            "auto",
          transform: [
            { center: "translateX(-50%)" }[style.hAlign] || "",
            { center: "translateY(50%)" }[style.vAlign] || "",
          ].join(" "),
          fontSize: `${style.size}px !important`,
          lineHeight: `calc(${style.size}px + ${style.size}px*0.1) !important`,
          color: `${style.color} !important`,
          fontFamily: `${style.font} !important`,
          margin: 0,
        }}
      >
        <Box
          component="p"
          className="subtitle"
          ref={subtitlesRef}
          sx={{
            width: "max-content",
            backgroundColor: style.bgcolor,
            margin: 0,
            height: "auto",
            display: "flex",
            alignItems: "center",
          }}
        ></Box>
      </Box>
    </Box>
  );
}
export default Subtitles;
