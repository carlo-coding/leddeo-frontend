import { Box, IconButton } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  addSubtitleItemAfterAnother,
  removeSubtitleItem,
  updateSubtitleItem,
} from "../../../../features/subtitle/subtitleSlice";
import { formatSeconds } from "../../../../utils";
import { timecodeToSeconds } from "../../../../utils/timeCodeToSeconds";
import { ControlledInput } from "../ControlledInput";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

interface TSubtitleTextItemProps {
  id: string;
  index: number;
}

function SubtitleTextItem({ id, index }: TSubtitleTextItemProps) {
  const dispatch = useAppDispatch();
  const item = useAppSelector(
    (state) =>
      state.subtitle.list.find((i) => i.id === id) ?? {
        end: 0,
        begin: 0,
        text: "",
        id: "",
      }
  );
  const currentSubtitleId = useAppSelector((state) => state.subtitle.currentId);
  const subtitles = useAppSelector((state) => state.subtitle.list);

  function validateTimeline(begin: number, end: number) {
    const itemIndex = subtitles.findIndex((i) => i.id === item.id);
    const nextitem = subtitles[itemIndex + 1];
    if (begin >= end) {
      //[TODO]: Show error
      alert("El tiempo de inicio no puede ser mayor al final");
      return false;
    } else if (nextitem && end > nextitem.begin) {
      //[TODO]: Show error
      alert("La línea de tiempo no es válida");
      return false;
    }
    return true;
  }

  const handleDeleteItem = () => {
    dispatch(removeSubtitleItem(item.id));
  };

  const handleAddItem = () => {
    dispatch(addSubtitleItemAfterAnother(item.id));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateSubtitleItem({ ...item, text: e.target.value }));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = timecodeToSeconds(e.target.value);
    if (validateTimeline(item.begin, newValue))
      dispatch(updateSubtitleItem({ ...item, end: newValue }));
  };

  const handleBeginTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = timecodeToSeconds(e.target.value);
    if (validateTimeline(newValue, item.end))
      dispatch(updateSubtitleItem({ ...item, begin: newValue }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        width: "100%",
        outline: "3px solid transparent",
        outlineColor: currentSubtitleId === item.id ? "#52af77" : "transparent",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          "& input": {
            maxWidth: "5.35em",
            height: "100%",
            backgroundColor: "layout.darkGray",
            color: "layout.white",
          },
        }}
      >
        <ControlledInput
          style={{ fontSize: "0.35em" }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="00:00.00"
          value={formatSeconds(item.begin)}
          onChange={handleBeginTimeChange}
        />
        <ControlledInput
          style={{ fontSize: "0.35em" }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="00:00.00"
          value={formatSeconds(item.end)}
          onChange={handleEndTimeChange}
        />
      </Box>
      <Box
        component="textarea"
        value={item.text}
        onChange={handleContentChange}
        sx={{
          width: "100%",
          borderRadius: "3px",
          padding: "5px",
          font: "inherit",
          fontSize: "0.35em",
          resize: "none",
          outline: "none",
          border: "none",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3px 0",
          backgroundColor: "layout.darkGray",
        }}
      >
        {index !== 0 ? (
          <IconButton
            sx={{
              color: "layout.white",
              fontSize: "0.35em",
              margin: "0",
              padding: "0",
            }}
            onClick={handleDeleteItem}
          >
            <HighlightOffIcon />
          </IconButton>
        ) : (
          <Box sx={{ height: "0.7em" }}></Box>
        )}
        <IconButton
          sx={{
            color: "layout.white",
            fontSize: "0.35em",
            margin: "0",
            padding: "0",
          }}
          onClick={handleAddItem}
        >
          <ControlPointIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
export default SubtitleTextItem;
