import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import * as Yup from "yup";
import { IUpdateUserPayload } from "../../../models";
import { Formik } from "formik";
import TextField from "@mui/material/TextField";
import { CButton } from "../../CButton";
import { updateUser } from "../../../features";

function EditUserInfo() {
  const user = useAppSelector((state) => state.user.data);
  const status = useAppSelector((state) => state.user.status);
  const dispatch = useAppDispatch();

  const initialFormValues: IUpdateUserPayload = {
    username: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Al menos 3 carácteres")
      .required("Campo requerido"),
  });

  const handleFormSubmit = (data: IUpdateUserPayload) => {
    dispatch(updateUser(data));
  };

  return (
    <Box>
      <Formik
        initialValues={
          user !== null
            ? {
                username: user.username,
              }
            : initialFormValues
        }
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched, handleSubmit, handleChange, handleBlur }) => {
          const getInputError = (
            field: keyof IUpdateUserPayload
          ): string | undefined => {
            return errors[field] !== "" && touched[field] !== undefined
              ? errors[field]
              : "";
          };

          return (
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
              onSubmit={handleSubmit}
            >
              <TextField
                defaultValue={user?.username}
                label="Nombre de usuario"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={getInputError("username")}
                error={Boolean(getInputError("username"))}
              />

              <CButton type="submit">Guardar cambios</CButton>
            </Box>
          );
        }}
      </Formik>
    </Box>
  );
}
export default EditUserInfo;
