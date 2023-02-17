import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 50,
    height: 20,
    backgroundColor: "#52af77",
    transformOrigin: "bottom",
  },
});

interface CSliderProps {
  value?: any;
  onChange?: any;
  max?: number;
}

function toTime(s: any, withMilliSecond: any) {
  try {
    if (withMilliSecond) return new Date(s * 1000).toISOString().substr(11, 11);
    return new Date(s * 1000).toISOString().substr(11, 8);
  } catch (error) {
    return "";
  }
}

function valuetext(value: number) {
  return `${toTime(value, false)}`;
}

export default function CSlider(props: CSliderProps) {
  return (
    <PrettoSlider
      valueLabelDisplay="auto"
      defaultValue={0}
      aria-label="video slider"
      getAriaValueText={valuetext}
      valueLabelFormat={valuetext}
      {...props}
    />
  );
}
