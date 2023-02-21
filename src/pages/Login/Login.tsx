import { CButton, Layout } from "../../components";
import { Box, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { googleAuth, login } from "../../features";
import { enqueueSnackbar } from "notistack";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { ILoginPayload } from "./interfaces/Login";
import * as Yup from "yup";
import { Formik } from "formik";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function Login() {
  const dispatch = useAppDispatch();

  const loginPage = useAppSelector(
    (state) => state.lang.pageLanguage.pages.login
  );

  const [searchParams] = useSearchParams();

  const created = searchParams.get("created");

  useEffect(() => {
    if (created === "true") {
      enqueueSnackbar(
        "Felicidades por crear una nueva cuenta, \
        ahora puedes iniciar sesión y por favor \
        verifica tu correo electrónico",
        {
          variant: "success",
        }
      );
      searchParams.delete("created");
    }
  }, [created]);

  const handleGoogleError = () =>
    enqueueSnackbar("Hubo un error obteniendo permisos de google", {
      variant: "error",
    });

  const handleGoogleResponse = async (
    response: CredentialResponse
  ): Promise<void> => {
    if (!response.credential) {
      handleGoogleError();
      return;
    }
    dispatch(
      googleAuth({
        token: response.credential,
      })
    );
  };

  const initialValues: ILoginPayload = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Al menos 3 carácteres")
      .required("Campo requerido"),
    password: Yup.string(),
  });

  const handleFormSubmit = async (values: ILoginPayload) => {
    dispatch(login(values));
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
              field: keyof ILoginPayload
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
                <h2>{loginPage.title}</h2>
                <p>{loginPage.description}</p>
                <TextField
                  label={loginPage.usernameLabel}
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={getInputError("username")}
                  error={Boolean(getInputError("username"))}
                  autoComplete="off"
                />
                <TextField
                  label={loginPage.passwordLabel}
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={getInputError("password")}
                  error={Boolean(getInputError("password"))}
                  autoComplete="off"
                />

                <CButton type="submit">{loginPage.submitButton}</CButton>

                <GoogleLogin
                  onSuccess={handleGoogleResponse}
                  onError={() => {
                    handleGoogleError();
                  }}
                />
              </Box>
            );
          }}
        </Formik>
      </Box>
    </Layout>
  );
}
export default Login;
