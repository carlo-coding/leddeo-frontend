import { Box } from "@mui/material";

interface CButtonProps {
  c?: string;
  children?: React.ReactNode;
  sx?: any;
  [s: string]: any;
}

function CButton({
  sx,
  c = "layout.darkGray",
  children,
  ...props
}: CButtonProps) {
  return (
    <Box
      component="button"
      sx={{
        backgroundColor:
          c === "layout.darkGray" ? "layout.darkGray" : "layout.white",
        color: c === "layout.darkGray" ? "layout.white" : c,
        fontWeight: "500",
        borderColor: c,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
export default CButton;
