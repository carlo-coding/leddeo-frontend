import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { CButton } from "../../../../components";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getId } from "../../../../utils";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { checkoutSession } from "../../../../features";
import { enqueueSnackbar } from "notistack";

interface Feature {
  content: string;
  included: boolean;
}

interface PlanPanelProps {
  title: string;
  lookup_key: string | null;
  subtitle?: string;
  price: string | number;
  features?: Feature[];
  buttonText?: string;
}

function PlanPanel({
  title,
  lookup_key,
  subtitle,
  price,
  buttonText,
  features,
}: PlanPanelProps) {
  const dispatch = useAppDispatch();
  const customer_id = useAppSelector(
    (state) => state.user.data?.info.customer_id
  );
  const handleCheckout = () => {
    if (!customer_id) {
      return enqueueSnackbar("Debes primero crear una cuenta", {
        variant: "info",
        autoHideDuration: 5000,
      });
    }
    if (!lookup_key) return;
    dispatch(checkoutSession({ customer_id, lookup_key }));
  };

  return (
    <Box
      sx={{
        backgroundColor: "layout.lightGray",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "20px",
      }}
    >
      <Typography sx={{ fontSize: "25px" }}>{title}</Typography>
      <Typography sx={{ fontSize: "14px" }}>{subtitle}</Typography>
      <Box
        sx={{
          height: "2px",
          backgroundColor: "layout.locoGray",
          width: "100%",
        }}
      ></Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "90px",
            textAlign: "center",
          }}
        >
          {price}
        </Typography>
        <Typography
          sx={{ margin: "auto 0 10px 0", fontSize: "20px", fontWeight: "600" }}
        >
          MX
        </Typography>
      </Box>
      {features?.map((f) => (
        <React.Fragment key={getId()}>
          <Box
            sx={{
              height: "2px",
              backgroundColor: "layout.locoGray",
              width: "100%",
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>{f.content}</Typography>
            {f.included ? (
              <CheckCircleIcon sx={{ color: "layout.darkGreen" }} />
            ) : (
              <CancelIcon sx={{ color: "layout.darkRed" }} />
            )}
          </Box>
        </React.Fragment>
      ))}

      <CButton sx={{ margin: "auto auto 0 auto" }} onClick={handleCheckout}>
        {buttonText ? buttonText : "¡El plan perfecto para mí!"}
      </CButton>
    </Box>
  );
}
export default PlanPanel;
