import { Modal, Box, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeModal } from "./redux/modalSlice";
import CloseIcon from "@mui/icons-material/Close";

function CustomModal(): JSX.Element {
  const open = useAppSelector((state) => state.modal.open);
  const content = useAppSelector((state) => state.modal.content);
  const dispatch = useAppDispatch();

  const handleCloseModal = (): void => {
    dispatch(closeModal());
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      sx={{
        padding: {
          md: "20px",
          xs: "10px",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "min(90vw, 550px)",
          bgcolor: "#666",
          boxShadow: 24,
          p: 4,
          borderRadius: "5px",
          backgroundColor: "layout.lightGray",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <IconButton onClick={handleCloseModal}>
            <CloseIcon color="error" />
          </IconButton>
        </Box>
        <Box>{content}</Box>
      </Box>
    </Modal>
  );
}
export default CustomModal;
