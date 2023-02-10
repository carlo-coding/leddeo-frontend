import { createTheme } from "@mui/material";

export const globalTheme = createTheme({
  palette: {
    layout: {
      lightGray: "#F4F4F4",
      navyBlue: "#0F62FE",
      darkRed: "#DA1E28",
      black: "black",
      darkGray: "#393939",
      veryDarkGray: "#161616",
      mediumGray: "#D9D9D9",
      locoGray: "#E0E0E0",
      darkGreen: "#24A148",
      white: "#FFFFFF",
    },
  },

  typography: {
    logo: {
      fontSize: "28px",
      color: "white",
      fontStyle: "italic",
      fontWeight: 700,
      background: "transparent",
      lineHeight: "60px",
      margin: "0 10px",
    },
  },
});

declare module "@mui/material" {
  interface TypographyVariants {
    logo: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    logo?: React.CSSProperties;
  }
  interface Palette {
    layout: {
      lightGray: string;
      navyBlue: string;
      darkRed: string;
      black: string;
      darkGray: string;
      veryDarkGray: string;
      mediumGray: string;
      locoGray: string;
      darkGreen: string;
      white: string;
    };
  }
  interface PaletteOptions {
    layout?: {
      lightGray?: string;
      navyBlue?: string;
      darkRed?: string;
      black?: string;
      darkGray?: string;
      veryDarkGray?: string;
      mediumGray?: string;
      locoGray: string;
      darkGreen?: string;
      white?: string;
    };
  }
}
