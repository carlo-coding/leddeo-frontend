import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  CButton,
  CountdownTimer,
  EditUserInfo,
  Layout,
  openModal,
  setModalContent,
  UserConfirm,
} from "../../components";
import { INTERVALS } from "../Plans/subcomps/CustomPanel/CustomPanel";
import { PrivateRoutes, PublicRoutes } from "../../models";
import {
  apiPrefix,
  apiUrl,
  formatDate,
  getCookie,
  isTrialActive,
  isValidPlan,
  redirectTo,
} from "../../utils";

function Profile() {
  const user = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activePlan = user?.plans?.find((p) => isValidPlan(p));
  const profilePage = useAppSelector(
    (state) => state.lang.pageLanguage.pages.profile
  );

  const SUBSCRIPTION_STATE = {
    incomplete: "Completada",
    incomplete_expired: "Expirado",
    trialing: "En prueba gratuita",
    active: "Activa",
    past_due: "Con adeudos",
    canceled: "Cancelada",
    unpaid: "Sin pagar",
  };

  const handleOpenEdit = () => {
    dispatch(setModalContent(<EditUserInfo />));
    dispatch(openModal());
  };

  const handleCancelAccount = async () => {
    const callback = async () => {
      const resp = await fetch(`${apiUrl}${apiPrefix}/plans`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${getCookie("access")}`,
        },
        body: JSON.stringify({
          subscription_id: activePlan?.stripe_subscription_id,
        }),
      });
      const data = await resp.json();
      if (data) {
        redirectTo(`/${PrivateRoutes.PRIVATE}`);
      }
    };
    dispatch(
      setModalContent(
        <UserConfirm cb={callback}>
          Al aceptar tu cuenta se cancelará al terminar el periodo actual
        </UserConfirm>
      )
    );
    dispatch(openModal());
  };

  const hadleActivateAccount = async () => {
    const callback = async () => {
      const resp = await fetch(`${apiUrl}${apiPrefix}/plans/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${getCookie("access")}`,
        },
        body: JSON.stringify({
          subscription_id: activePlan?.stripe_subscription_id,
        }),
      });
      const data = await resp.json();
      if (data) {
        redirectTo(`/${PrivateRoutes.PRIVATE}`);
      }
    };
    dispatch(
      setModalContent(
        <UserConfirm cb={callback}>
          Se te cobrará al terminar el periodo actual
        </UserConfirm>
      )
    );
    dispatch(openModal());
  };

  return (
    <Layout>
      <Box
        sx={{
          fontSize: {
            md: "16px",
            xs: "12px",
          },
          background: "white",
          flexGrow: 1,
          display: "flex",
          placeItems: "center",
          justifyContent: "center",
          padding: "1.6em",
        }}
      >
        <Box
          sx={{
            backgroundColor: "layout.lightGray",
            flexGrow: 1,
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: {
              md: "3fr 2fr",
              xs: "1fr",
            },
            gridTemplateRows: {
              md: "50px 2fr 1fr",
              xs: "auto",
            },
            alignItems: "center",
            gap: "1.7em",
            padding: "1.7em",
            "& >*": {
              display: "grid",
              alignItems: "center",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "1.7em",
            }}
          >
            {profilePage.title}
          </Typography>
          <CButton
            sx={{
              marginLeft: "auto",
              padding: "0.7em 2.8em",
            }}
            onClick={handleOpenEdit}
          >
            {profilePage.editButton}
          </CButton>
          {/* Profile box */}
          <Box
            sx={{
              backgroundColor: "layout.white",
              flexGrow: 1,
              width: "100%",
              height: "100%",
              display: "grid",
              padding: "0.9em",
              gap: "0.7em",
              gridColumn: "1 / 3",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.5em",
              }}
            >
              {user?.username}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.4em",
              }}
            >
              {activePlan && "Tiempo restante del plan"}
            </Typography>
            <Typography
              sx={{
                fontSize: "2em",
                fontStyle: "italic",
              }}
            >
              {activePlan?.current_period_end && (
                <CountdownTimer date={activePlan.current_period_end} />
              )}
            </Typography>
            <Box
              sx={{
                height: "2px",
                backgroundColor: "layout.lightGray",
                width: "100%",
              }}
            ></Box>
            {activePlan?.name && (
              <>
                <Typography
                  sx={{
                    fontSize: "1.7em",
                  }}
                >
                  Plan actual:
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2em",
                  }}
                >
                  {activePlan?.name}
                </Typography>
              </>
            )}

            <Typography
              sx={{
                fontSize: "1.2em",
              }}
            >
              {activePlan && !isTrialActive(activePlan.trial_end)
                ? `Usted está pagando ${activePlan?.currency?.toUpperCase()}$
              ${activePlan.unit_amount / 100} ${INTERVALS[activePlan.interval]}`
                : ""}
              {activePlan && isTrialActive(activePlan.trial_end)
                ? `Se le cobrarán ${activePlan?.currency?.toUpperCase()}$
              ${activePlan.unit_amount / 100} ${
                    INTERVALS[activePlan.interval]
                  } al terminar
              el periodo gratuito`
                : ""}
            </Typography>

            <Typography
              sx={{
                fontSize: "1.2em",
              }}
            >
              {user && user.info.balance
                ? `Su balance actual es de ${user.info.balance / 100}`
                : ""}
            </Typography>

            {activePlan && (
              <Typography
                sx={{
                  fontSize: "1.2em",
                }}
              >
                {`Estado actual: ${
                  SUBSCRIPTION_STATE[
                    activePlan.status as keyof typeof SUBSCRIPTION_STATE
                  ]
                }`}
              </Typography>
            )}
            {activePlan?.cancel_at && (
              <Typography
                sx={{
                  fontSize: "1.2em",
                }}
              >
                {`Este plan se cancelará en: ${formatDate(
                  activePlan.cancel_at
                )}`}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                gap: "0.9em",
                alignSelf: "center",
                flexWrap: "wrap",
              }}
            >
              {user?.plans?.length ? (
                <CButton
                  c="layout.navyBlue"
                  onClick={() => {
                    navigate(
                      `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.HISTORY}`
                    );
                  }}
                >
                  Ver historial de facturación
                </CButton>
              ) : (
                ""
              )}
              {(activePlan?.status === "active" ||
                activePlan?.status === "trialing") &&
                !activePlan.cancel_at && (
                  <CButton
                    c="layout.darkRed"
                    sx={{
                      marginLeft: {
                        md: "auto",
                        xs: 0,
                      },
                    }}
                    onClick={handleCancelAccount}
                  >
                    Cancelar cuenta
                  </CButton>
                )}
              {(activePlan?.status === "active" ||
                activePlan?.status === "trialing") &&
                activePlan.cancel_at && (
                  <CButton
                    c="layout.navyBlue"
                    sx={{
                      marginLeft: {
                        md: "auto",
                        xs: 0,
                      },
                    }}
                    onClick={hadleActivateAccount}
                  >
                    Reactivar cuenta
                  </CButton>
                )}
              {!activePlan && (
                <CButton
                  c="layout.navyBlue"
                  sx={{
                    marginLeft: {
                      md: "auto",
                      xs: 0,
                    },
                  }}
                  onClick={() => navigate(`/${PublicRoutes.PLANS}`)}
                >
                  Ver planes
                </CButton>
              )}
            </Box>
          </Box>
          {/* End Profile box */}

          <div></div>
          <Box
            sx={{
              backgroundColor: "layout.white",
              width: "100%",
              height: "100%",
              padding: "0.9em",
            }}
          >
            <Typography>{profilePage.supportQuestion}</Typography>
            <Box
              sx={{
                padding: "0.6em 0.9em",
                backgroundColor: "layout.darkGray",
                color: "layout.white",
                "& a": {
                  color: "layout.white",
                },
              }}
            >
              {profilePage.supportMessage}{" "}
              <a href="mailto:support@leddeo.com">support@leddeo.com</a>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
export default Profile;
