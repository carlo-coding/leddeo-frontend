import { Box, FormControlLabel, Checkbox } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { CButton, Layout } from "../../components";
import { googleAuth, signup } from "../../features";
import { ISignUpPayload } from "../../models";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { enqueueSnackbar } from "notistack";
import { ISignupPayload } from "./interfaces/Signup";
import * as Yup from "yup";
import { Formik } from "formik";
import { TextField } from "@mui/material";
import { useState } from "react";

function Signup() {
  const dispatch = useAppDispatch();
  const [temrsChecked, setTermsChecked] = useState(false);
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTermsChecked(e.currentTarget.checked);
  };

  const handleGoogleError = () =>
    enqueueSnackbar("Hubo un error obteniendo permisos de google", {
      variant: "error",
    });

  const handleGoogleResponse = async (
    response: CredentialResponse
  ): Promise<void> => {
    if (!temrsChecked) {
      enqueueSnackbar("Primero debes aceptar los términos y condiciones", {
        variant: "error",
      });
      return;
    }
    if (!response.credential) {
      handleGoogleError();
      return;
    }
    dispatch(googleAuth(response.credential));
  };

  const initialValues: ISignupPayload = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Al menos 3 carácteres")
      .required("Campo requerido"),
    email: Yup.string()
      .required("Campo requerido")
      .email("Debes ingresar un correo válido"),
    password: Yup.string()
      .min(8, "Debe tener al menos 8 carácteres")
      .test(
        "Debe contener al menos un número",
        "Debe contener al menos un número",
        (password) => /\d/.test(password ?? "")
      )
      .test(
        "Debe tener al menos una letra mayúscula",
        "Debe tener al menos una letra mayúscula",
        (password) => /[A-Z]/.test(password ?? "")
      )
      .test(
        "Debe tener al menos un carácter especial",
        "Debe tener al menos un carácter especial",
        (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password ?? "")
      ),
  });

  const handleFormSubmit = async (values: ISignupPayload) => {
    if (!temrsChecked) {
      enqueueSnackbar("Primero debes aceptar los términos y condiciones", {
        variant: "error",
      });
      return;
    }
    dispatch(signup(values));
  };

  return (
    <Layout showFooter>
      <Box
        sx={{
          backgroundColor: "layout.lightGray",
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ errors, touched, handleSubmit, handleChange, handleBlur }) => {
            const getInputError = (
              field: keyof ISignUpPayload
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
                  boxShadow: "3px 4px 8px 5px rgba(0,0,0,0.26)",
                  padding: "35px",
                }}
                onSubmit={handleSubmit}
              >
                <h2>Crear una cuenta</h2>
                <p>Información personal</p>
                <TextField
                  label="Nombre de usuario"
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={getInputError("username")}
                  error={Boolean(getInputError("username"))}
                />
                <TextField
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={getInputError("email")}
                  error={Boolean(getInputError("email"))}
                />
                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={getInputError("password")}
                  error={Boolean(getInputError("password"))}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    onChange={handleTermsChange}
                    checked={temrsChecked}
                  />
                  <a target="_blank" href="terms">
                    Acepto los términos y condiciones
                  </a>
                </Box>

                {temrsChecked && (
                  <>
                    <CButton type="submit">Crear cuenta</CButton>

                    <GoogleLogin
                      onSuccess={handleGoogleResponse}
                      onError={() => {
                        handleGoogleError();
                      }}
                    />
                  </>
                )}
              </Box>
            );
          }}
        </Formik>
      </Box>
    </Layout>
  );
}
export default Signup;
