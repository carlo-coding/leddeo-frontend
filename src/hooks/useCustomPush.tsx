import { NavigateOptions, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import {
  closeModal,
  openModal,
  setModalContent,
  UserConfirm,
} from "../components";

interface ICustomOptions {
  verifyOnPaths?: string[];
  verifyMessage?: string;
}

export function useCustomPush() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  return (
    path: string,
    customOptions: ICustomOptions = {
      verifyOnPaths: ["/editor"],
      verifyMessage: "¿Quieres salir de la página?, perderás tus cambios",
    },
    options: NavigateOptions = { replace: true }
  ) => {
    const cb = () => {
      navigate(path, options);
      dispatch(closeModal());
    };
    if (
      customOptions.verifyOnPaths?.includes(location.pathname) &&
      customOptions.verifyMessage
    ) {
      dispatch(
        setModalContent(
          <UserConfirm cb={cb}>{customOptions.verifyMessage}</UserConfirm>
        )
      );
      dispatch(openModal());
    } else {
      cb();
    }
  };
}
