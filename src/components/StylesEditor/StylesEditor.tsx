import {
  Box,
  IconButton,
  Popover,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSubtitleStyle } from "../../features/subtitle/subtitleSlice";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignCenterIcon from "@mui/icons-material/VerticalAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import BrushIcon from "@mui/icons-material/Brush";
import { CompactPicker, ColorResult } from "react-color";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import { useState } from "react";

function WrapColorIcon({ children, color }: any) {
  return (
    <Box
      sx={{
        position: "relative",
        "&::after": {
          content: "''",
          position: "absolute",
          top: "-8px",
          right: "-8px",
          borderRadius: "50%",
          width: "10px",
          height: "10px",
          backgroundColor: color,
        },
      }}
    >
      {children}
    </Box>
  );
}

function StylesEditor() {
  const style = useAppSelector((state) => state.subtitle.style);
  const [sendBgColor, setSendBgColor] = useState(true);
  const dispatch = useAppDispatch();
  const fonts = useAppSelector((state) => state.font.list);
  const editor = useAppSelector(
    (state) => state.lang.pageLanguage.pages.editor
  );

  const vertAlignVals = {
    bottom: "top",
    top: "center",
    center: "bottom",
  };
  const horAlignVals = {
    left: "center",
    center: "right",
    right: "left",
  };

  const horAlignIcons = {
    left: <FormatAlignLeftIcon sx={{ color: "layout.veryDarkGray" }} />,
    center: <FormatAlignJustifyIcon sx={{ color: "layout.veryDarkGray" }} />,
    right: <FormatAlignRightIcon sx={{ color: "layout.veryDarkGray" }} />,
  };

  const vertAlignIcons = {
    bottom: <VerticalAlignBottomIcon sx={{ color: "layout.veryDarkGray" }} />,
    top: <VerticalAlignTopIcon sx={{ color: "layout.veryDarkGray" }} />,
    center: <VerticalAlignCenterIcon sx={{ color: "layout.veryDarkGray" }} />,
  };

  const handleSelectVerAlign = () => {
    const newVertAlign =
      vertAlignVals[style.vAlign as keyof typeof vertAlignVals];
    dispatch(setSubtitleStyle({ ...style, vAlign: newVertAlign }));
  };

  const handleSelectHorAlign = () => {
    const newHorAlign = horAlignVals[style.hAlign as keyof typeof horAlignVals];
    dispatch(setSubtitleStyle({ ...style, hAlign: newHorAlign }));
  };

  const [anchorColorEl, setAnchorColorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [anchorBgColorEl, setAnchorBgColorEl] =
    useState<HTMLButtonElement | null>(null);

  const handleColorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorColorEl(event.currentTarget);
  };
  const handleBgColorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorBgColorEl(event.currentTarget);
  };

  const handleCloseColor = () => {
    setAnchorColorEl(null);
  };
  const handleCloseBgColor = () => {
    setAnchorBgColorEl(null);
  };

  const handleColorChange = (color: ColorResult) => {
    const rgb = `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`;
    dispatch(setSubtitleStyle({ ...style, color: rgb }));
  };

  const handleBgColorChange = (color?: ColorResult) => {
    if (!color) return dispatch(setSubtitleStyle({ ...style, bgcolor: color }));
    const rgb = `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`;
    dispatch(setSubtitleStyle({ ...style, bgcolor: rgb }));
  };

  const handleSelectFont = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSubtitleStyle({ ...style, font: e.target.value }));
  };

  const handleSelectSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size =
      Number.isNaN(parseFloat(e.target.value)) ||
      parseFloat(e.target.value) <= 0
        ? 0
        : parseFloat(e.target.value);
    dispatch(setSubtitleStyle({ ...style, size }));
  };

  function truncateString(str: string) {
    if (str.length > 19) {
      return str.substring(0, 19) + "...";
    }
    return str;
  }
  return (
    <Box
      sx={{
        padding: "10px",
        fontSize: "0.4em",
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={sendBgColor}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSendBgColor(event.target.checked);
              if (!event.target.checked) handleBgColorChange();
            }}
          />
        }
        label={editor.styleEditorBackground}
      />
      <Box
        sx={{
          display: "flex",
        }}
      >
        <IconButton onClick={handleSelectVerAlign}>
          {vertAlignIcons[style.vAlign as keyof typeof vertAlignIcons]}
        </IconButton>
        <IconButton onClick={handleSelectHorAlign}>
          {horAlignIcons[style.hAlign as keyof typeof horAlignIcons]}
        </IconButton>
        <IconButton onClick={handleColorClick}>
          <WrapColorIcon color={style.color}>
            <FormatColorTextIcon
              sx={{
                color: "layout.veryDarkGray",
              }}
            />
          </WrapColorIcon>
        </IconButton>
        <IconButton onClick={handleBgColorClick} disabled={!sendBgColor}>
          <WrapColorIcon color={style.bgcolor}>
            <BrushIcon
              sx={{
                color: sendBgColor
                  ? "layout.veryDarkGray"
                  : "layout.mediumGray",
              }}
            />
          </WrapColorIcon>
        </IconButton>
        <Popover
          id={Boolean(anchorColorEl) ? "simple-popover" : undefined}
          open={Boolean(anchorColorEl)}
          anchorEl={anchorColorEl}
          onClose={handleCloseColor}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <CompactPicker
            onChangeComplete={handleColorChange}
            color={style.color}
          />
        </Popover>

        <Popover
          id={Boolean(anchorBgColorEl) ? "simple-popover" : undefined}
          open={Boolean(anchorBgColorEl)}
          anchorEl={anchorBgColorEl}
          onClose={handleCloseBgColor}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <CompactPicker
            onChangeComplete={handleBgColorChange}
            color={style.bgcolor}
          />
        </Popover>
      </Box>
      <Box
        sx={{
          "& > select, input": {
            backgroundColor: "layout.darkGray",
            color: "layout.white",
          },
        }}
      >
        <p>{editor.styleEditorFont}</p>
        <select onChange={handleSelectFont} value={style.font}>
          {fonts?.map((font) => (
            <option key={font} value={font}>
              {truncateString(font)}
            </option>
          ))}
        </select>
        <p>{editor.styleEditorSize}</p>
        <input type="number" value={style.size} onChange={handleSelectSize} />
      </Box>
    </Box>
  );
}
export default StylesEditor;
