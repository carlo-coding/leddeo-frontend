import { Box } from "@mui/material";
import { useAppDispatch } from "../../../app/hooks";
import { CButton } from "../../CButton";
import { closeModal } from "../redux";

interface IUserConfirmProps {
  children?: React.ReactNode;
  cb: () => void;
}
function UserConfirm({ children, cb }: IUserConfirmProps): JSX.Element {
  const dispatch = useAppDispatch();
  const handleClose = (): void => {
    dispatch(closeModal());
  };

  return (
    <>
      <Box
        sx={{
          color: "layout.veryDarkGray",
        }}
      >
        <Box>{children}</Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <CButton onClick={handleClose}>Cancelar</CButton>
          <CButton onClick={cb}>Aceptar</CButton>
        </Box>
      </Box>
    </>
  );
}
export default UserConfirm;
