import { Box } from "@mui/material";

interface CButtonProps {
  c?: string;
  children?: React.ReactNode;
  sx?: any;
  disabled?: boolean;
  [s: string]: any;
}

function CButton({
  sx,
  c = "layout.darkGray",
  children,
  disabled = false,
  ...props
}: CButtonProps) {
  let backgroundColor;
  let color;
  let borderColor;
  if (disabled) {
    backgroundColor = "rgba(180,180,180,0.8)";
    color = "rgba(50,50,50,0.3)";
    borderColor = "transparent";
  } else {
    backgroundColor =
      c === "layout.darkGray" ? "layout.darkGray" : "layout.white";
    color = c === "layout.darkGray" ? "layout.white" : c;
    borderColor = c;
  }
  return (
    <Box
      component="button"
      sx={{
        backgroundColor: backgroundColor,
        color: color,
        fontWeight: "500",
        borderColor: borderColor,
        ...sx,
      }}
      {...props}
      disabled={disabled}
    >
      {children}
    </Box>
  );
}
export default CButton;
