import { Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { checkoutSession } from "../../../../features";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import {
  CButton,
  openModal,
  setModalContent,
  UserConfirm,
} from "../../../../components";
import { Link } from "react-router-dom";
import { PublicRoutes } from "../../../../models";
import { apiPrefix, apiUrl, isValidPlan } from "../../../../utils";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  variant: "fullWidth";
}
interface StyledTabProps {
  label: string;
}
const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "transparent",
  },
});
const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: "#222",
  transition: "background 0.1s ease",
  "&.Mui-selected": {
    color: "#fff",
    backgroundColor: "#222",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));

export const INTERVALS = {
  month: "al mes",
  year: "al año",
};

const PLAN_NAMES = {
  month: "Plan mensual",
  year: "Plan anual",
};

function CustomPanel() {
  const dispatch = useAppDispatch();
  const customer_id = useAppSelector(
    (state) => state.user.data?.info.customer_id
  );
  const plans = useAppSelector((state) => state.user.data?.plans);

  const [platformPrices, setPlatformPrices] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      const resp = await fetch(`${apiUrl}${apiPrefix}/plans/prices`);
      const data = await resp.json();
      setPlatformPrices(data.data);
    })();
  }, []);

  const handleCheckout = (lookup_key: string) => () => {
    if (!customer_id) {
      return enqueueSnackbar("Debes primero crear una cuenta", {
        variant: "warning",
        autoHideDuration: 5000,
        action: () => (
          <Box sx={{}}>
            <Link
              to={PublicRoutes.SIGNUP}
              style={{
                color: "white",
              }}
            >
              Crear cuenta
            </Link>
          </Box>
        ),
      });
    }
    if (!lookup_key) return;
    const plan = plans?.find(
      (p) => p.lookup_key === lookup_key && isValidPlan(p)
    );
    if (plan) {
      return enqueueSnackbar("Ya tienes este plan", {
        variant: "warning",
        autoHideDuration: 3000,
      });
    }
    const otherPlan = plans?.find((p) => isValidPlan(p));
    if (otherPlan) {
      dispatch(
        setModalContent(
          <UserConfirm
            cb={() => {
              dispatch(checkoutSession({ customer_id, lookup_key }));
            }}
          >
            El tiempo no usado del plan actual se te añadirá al que deseas
            actualizar, además si el plan es inferior se te añadirá como saldo a
            favor
          </UserConfirm>
        )
      );
      dispatch(openModal());
      return;
    }
    dispatch(checkoutSession({ customer_id, lookup_key }));
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const prices = platformPrices.sort(
    (a: any, b: any) => a.unit_amount - b.unit_amount
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
        >
          {prices.map((p: any, index: number) => {
            return (
              <StyledTab
                key={p.lookup_key}
                label={
                  PLAN_NAMES[p.recurring.interval as keyof typeof PLAN_NAMES]
                }
                {...a11yProps(index)}
              />
            );
          })}
        </StyledTabs>
      </Box>
      {prices.map((p: any, index: number) => {
        return (
          <TabPanel value={value} index={index} key={p.lookup_key}>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                flexDirection: "column",
              }}
            >
              <h3>{p.nickname}</h3>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "37px",
                    fontWeight: "500",
                  }}
                >
                  {p.currency.toUpperCase()}${p.unit_amount / 100}
                </Typography>
                <small>
                  {INTERVALS[p.recurring.interval as keyof typeof INTERVALS]}
                </small>
              </Box>
              {p.recurring.interval === "year" && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <small>
                    {p.currency.toUpperCase()}${p.unit_amount / 100 / 12}{" "}
                    {INTERVALS["month"]}
                  </small>
                </Box>
              )}
              {p.recurring.trial_period_days && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <small>
                    {p.recurring.trial_period_days} Días de prueba gratuita
                  </small>
                </Box>
              )}
              <CButton onClick={handleCheckout(p.lookup_key)}>
                Continuar
              </CButton>
            </Box>
          </TabPanel>
        );
      })}
    </Box>
  );
}
export default CustomPanel;
