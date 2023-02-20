import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addEmptySubtitleItem } from "../../features/subtitle/subtitleSlice";
import { CButton } from "../CButton";
import { SubtitleTextItem } from "./subcomps";

function SubtitleEditor() {
  const data = useAppSelector((state) => state.subtitle.list);
  const dispatch = useAppDispatch();
  const handleAddSubtitle = () => {
    dispatch(addEmptySubtitleItem());
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "visible",
        height: "100%",
        maxHeight: "100%",
        flexGrow: 1,
        gap: "3px",
        paddingTop: "3px",
        border: "1px solid",
        borderColor: "layout.darkGray",
        alignItems: "center",
        position: "relative",
        backgroundColor: "#393939",
      }}
    >
      {data.map((item, index) => (
        <SubtitleTextItem key={item.id} id={item.id} index={index} />
      ))}
      <CButton
        onClick={handleAddSubtitle}
        sx={{
          backgroundColor: "layout.darkGray",
          color: "layout.white",
          padding: "0.9em 0.5em",
          fontSize: "0.35em",
          width: "100%",
        }}
      >
        Agregar nuevo subtítulo
      </CButton>
    </Box>
  );
}
export default SubtitleEditor;
