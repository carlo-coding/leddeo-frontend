import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
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

  const [sbMargin, setSbMargin] = useState(20);
  const [stMargin, setStMargin] = useState(20);

  const dispatch = useAppDispatch();

  const style = useAppSelector((state) => state.subtitle.style);

  const subtitles = useAppSelector((state) => state.subtitle.list);

  const handleTimeUpdate = (e: any) => {
    if (subtitlesRef.current === null) return;
    const currt = e.target.currentTime;
    const subtitle = subtitles.find((subt) => {
      return currt >= subt.begin && currt < subt.end;
    });
    if (!subtitle) {
      subtitlesRef.current.textContent = "";
      dispatch(setCurrentSubtitleId(undefined));
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
      if (el) {
        dispatch(
          updateBrokenSubtitleList({
            ...subtitle,
            text: linesFromTextNode(el).join("\n"),
          })
        );
      }
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

  const ar =
    (videoRef.current?.videoWidth || 0) / (videoRef.current?.videoHeight || 1);

  const width = ar * (containerRef.current?.clientHeight || 1);

  useEffect(() => {
    /* 
    En el cuerpo de la función de efecto, 
    primero se define una función llamada listener que calcula los valores de 
    vr, sr, r, e ir. vr es la relación de aspecto del video, 
    que se calcula dividiendo su ancho (videoRef.current?.videoWidth) 
    por su altura (videoRef.current?.videoHeight). 
    sr es la relación de aspecto del contenedor de subtítulos, 
    que se calcula dividiendo su ancho (containerRef.current?.clientWidth) 
    por su altura (containerRef.current?.clientHeight). r es la diferencia 
    entre las relaciones de aspecto del video y el contenedor de subtítulos, 
    pero nunca será menor que cero. ir es similar a r, pero se invierte y 
    también nunca será menor que cero. 
    Luego se actualizan los estados stMargin y sbMargin
    */
    const listener = () => {
      const vr =
        (videoRef.current?.videoWidth || 0) /
        (videoRef.current?.videoHeight || 1);
      const sr =
        (containerRef.current?.clientWidth || 0) /
        (containerRef.current?.clientHeight || 1);
      const r = vr - sr < 0 ? 0 : vr - sr;
      const ir = 1 / vr - 1 / sr < 0 ? 0 : 1 / vr - 1 / sr;
      setStMargin((ir * (containerRef.current?.clientWidth || 0)) / 4);
      setSbMargin(((containerRef.current?.clientHeight || 0) * r) / 4);
    };
    listener();
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);
  const flexDirections = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  return (
    <Box
      sx={{
        width: "100%",
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
          width: ar > 1 ? "80%" : `${width * 0.8}px`,
          display: "flex",
          justifyContent:
            flexDirections[style.hAlign as keyof typeof flexDirections],
          textAlign: style.hAlign,
          bottom:
            {
              bottom: `calc(10% + ${sbMargin}px)`,
              top: "auto",
              center: "50%",
            }[style.vAlign] || "auto",
          top:
            {
              bottom: "auto",
              top: `calc(10% + ${sbMargin}px)`,
              center: "auto",
            }[style.vAlign] || "auto",
          left:
            { left: `calc(10% + ${stMargin}px)`, right: "auto", center: "50%" }[
              style.hAlign
            ] || "auto",
          right:
            {
              left: "auto",
              right: `calc(10% + ${stMargin}px)`,
              center: "auto",
            }[style.hAlign] || "auto",
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
