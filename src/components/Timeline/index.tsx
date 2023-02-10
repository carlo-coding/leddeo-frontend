import { memo, useEffect, useMemo, useRef, useState } from "react";
import TimeLine from "./T.js";
import "./index.css";

interface TimelineProps {
  setAligns(z: any): void;
  audioRef: any;
  autoScroll: boolean;
  colors: { [s: string]: string };
  data: { [s: string]: any }[];
  paddingLeft: string;
}

function Timeline(props: TimelineProps) {
  const [zoomLevel, setZoomLevel] = useState(20);
  const [shift, setShift] = useState(0);
  const [currentPrtcl, setCurrentPrtcl] = useState(undefined);

  const timeLine = useRef<ReturnType<typeof TimeLine> | null>(null);

  const canvas1 = useRef<HTMLCanvasElement | null>(null);
  const canvasAudio = useRef(null);
  const canvas2 = useRef<HTMLCanvasElement | null>(null);

  let endTime: number = useMemo(() => {
    if (props.data?.length > 0) {
      let time = props.data[props.data?.length - 1]
        ? props.data[props.data?.length - 1].end * 1.2
        : 60;
      if (props.data[props.data?.length - 1].end > time) {
        console.error("Video time is less than the alignments end time");
        return props.data[props.data?.length - 1].end;
      }
      return time;
    }
    return 16;
  }, [props.data]);

  useEffect(() => {
    if (!canvas1.current || !canvas2.current) return;
    let width = canvas1.current?.parentElement?.parentElement?.clientWidth ?? 0;
    setZoomLevel(width / (endTime / Math.E));
  }, [canvas1.current, canvas2.current, endTime]);

  const drawTimeLine = (p: any) => {
    return TimeLine({
      canvas: canvas1.current,
      canvas2: canvas2.current,
      alignments: p.data,
      endTime: p.endTime,
      getPlayer: () =>
        props.audioRef ? props.audioRef.current : canvasAudio.current,
      changeAlignment: props.setAligns,
      changeZoomLevel: setZoomLevel,
      changeShift: setShift,
      setCurrentPrtcl: setCurrentPrtcl,
      zoomLevel: zoomLevel,
      currentPrtcl: currentPrtcl,
      shift: shift,
      options: {
        autoScroll: props.autoScroll,
        colors: {
          background: props.colors?.background || "transparent",
          box: props.colors?.box || "#a9a9a9",
          boxHover: props.colors?.boxHover || "#80add6",
          selectedBox: props.colors?.selectedBox || "#1890ff",
          playingBox: props.colors?.playingBox || "#f0523f",
          text: props.colors?.text || "#212b33",
          selectedText: props.colors?.selectedText || "white",
          tooltipBackground: props.colors?.tooltipBackground || "#474e54",
          tooltipText: props.colors?.tooltipText || "white",
          scrollBarBackground: props.colors?.scrollBarBackground || "#f1f3f9",
          scrollBar: props.colors?.scrollBar || "#c2c9d6",
          scrollBarHover: props.colors?.scrollBarHover || "#8f96a3",
        },
      },
    });
  };

  useEffect(() => {
    if (props.data?.length > 0) {
      timeLine.current = drawTimeLine({ ...props, endTime });
    }

    return () => {
      timeLine.current?.cancelAnimate();
      timeLine.current?.removeListeners();
    };
  }, [props.data]);

  const style = {
    height: "90px",
    paddingLeft: props.paddingLeft,
  };
  return (
    <div style={style} className="timeline-editor">
      <div className="wrap z-index-2">
        <canvas ref={canvas1}></canvas>
      </div>
      <div className="wrap z-index-1">
        <canvas ref={canvas2}></canvas>
      </div>
    </div>
  );
}

export default Timeline;
