import { ThemeProvider } from "@mui/material";
import { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { Navigate, Route } from "react-router-dom";
import { store } from "./app/store";
import { InitLoads, Loading, RoutesWith404 } from "./components";
import { AuthGuard } from "./guards";
import VideoGuard from "./guards/VideoGuard";
import { PrivateRoutes, PublicRoutes } from "./models";
import { Private } from "./pages/Private";
import { defaultTheme } from "./themes";
import { SnackbarProvider } from "notistack";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Upload = lazy(async () => await import("./pages/Upload/Upload"));
const Editor = lazy(async () => await import("./pages/Editor/Editor"));
const Plans = lazy(async () => await import("./pages/Plans/Plans"));
const Signup = lazy(async () => await import("./pages/Signup/Signup"));
const Login = lazy(async () => await import("./pages/Login/Login"));
const Options = lazy(async () => await import("./pages/Options/Options"));
const SrtUpload = lazy(async () => await import("./pages/SrtUpload/SrtUpload"));
const Faqs = lazy(async () => await import("./pages/Faqs/Faqs"));
const Landing = lazy(async () => await import("./pages/Landing/Landing"));
const TermsConditions = lazy(
  async () => await import("./pages/TermsConditions/TermsConditions")
);
const Verified = lazy(async () => await import("./pages/Verified/Verified"));

function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<Loading />}>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
        >
          <SnackbarProvider autoHideDuration={3000}>
            <ThemeProvider theme={defaultTheme}>
              <InitLoads>
                <RoutesWith404>
                  <Route
                    path="/"
                    element={<Navigate to={PublicRoutes.LANDING} />}
                  />
                  <Route
                    path={PublicRoutes.TERMS}
                    element={<TermsConditions />}
                  />
                  <Route path={PublicRoutes.VERIFIED} element={<Verified />} />
                  <Route path={PublicRoutes.LANDING} element={<Landing />} />
                  <Route path={PublicRoutes.UPLOAD} element={<Upload />} />
                  <Route path={PublicRoutes.PLANS} element={<Plans />} />
                  <Route path={PublicRoutes.SIGNUP} element={<Signup />} />
                  <Route path={PublicRoutes.LOGIN} element={<Login />} />
                  <Route path={PublicRoutes.FAQS} element={<Faqs />} />
                  <Route element={<AuthGuard />}>
                    <Route
                      path={`${PrivateRoutes.PRIVATE}/*`}
                      element={<Private />}
                    />
                  </Route>
                  <Route element={<VideoGuard />}>
                    <Route path={PublicRoutes.EDITOR} element={<Editor />} />
                    <Route path={PublicRoutes.OPTIONS} element={<Options />} />
                    <Route
                      path={PublicRoutes.SRT_UPLOAD}
                      element={<SrtUpload />}
                    />
                  </Route>
                </RoutesWith404>
              </InitLoads>
            </ThemeProvider>
          </SnackbarProvider>
        </GoogleOAuthProvider>
      </Suspense>
    </Provider>
  );
}

export default App;
