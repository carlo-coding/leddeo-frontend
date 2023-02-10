import { Box } from "@mui/material";
import { memo, useEffect, useRef } from "react";
import { useAppSelector } from "../../app/hooks";
import { TSubtitleItem } from "../../models/responses";

interface TSubtitlesProps {
  data: TSubtitleItem[];
  children?: React.ReactNode;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

function Subtitles({ videoRef, children }: TSubtitlesProps) {
  const subtitlesRef = useRef<HTMLParagraphElement | null>(null);
  const containerRef = useRef<HTMLParagraphElement | null>(null);

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
    subtitlesRef.current.textContent =
      typeof subtitle?.text === "string" ? subtitle.text : null;
  };

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
        component="p"
        sx={{
          position: "absolute",
          width: "100%",
          display: "flex",
          justifyContent:
            flexDirections[style.hAlign as keyof typeof flexDirections],
          textAlign: style.hAlign,
          bottom:
            { bottom: "0", top: "auto", center: "50%" }[style.vAlign] || "auto",
          top:
            { bottom: "auto", top: "0", center: "auto" }[style.vAlign] ||
            "auto",
          left:
            { left: "0", right: "auto", center: "50%" }[style.hAlign] || "auto",
          right:
            { left: "auto", right: "0", center: "auto" }[style.hAlign] ||
            "auto",
          transform: [
            { center: "translateX(-50%)" }[style.hAlign] || "",
            { center: "translateY(50%)" }[style.vAlign] || "",
          ].join(" "),
          fontSize: `${style.size}px !important`,
          lineHeight: `${style.size}px !important`,
          color: `${style.color} !important`,
          fontFamily: `${style.font} !important`,
          margin: 0,
        }}
      >
        <Box
          component="span"
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
