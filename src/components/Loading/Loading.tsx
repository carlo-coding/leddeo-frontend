import { Box, CircularProgress, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useState, useEffect } from "react";
import { setSecondsDuration } from "../../features/duration/durationSlice";
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "250px", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="layout.white">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function Loading(): JSX.Element {
  const seconds = useAppSelector((state) => state.duration.seconds);
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 0.1);
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (progress > seconds) {
      dispatch(setSecondsDuration(0));
    }
  }, [progress]);

  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        flexGrow: 1,
        minWidth: "100vw",
        minHeight: "100vh",
        position: "fixed",
        zIndex: "9999",
        backgroundColor: "#222",
        inset: 0,
      }}
    >
      {seconds > 0 ? (
        <LinearProgressWithLabel value={(progress / seconds) * 100} />
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
}
export default Loading;
