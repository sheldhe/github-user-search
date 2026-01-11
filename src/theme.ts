import { createTheme } from "@mui/material/styles";

const PRIMARY = "#0f4e8a";
const SECONDARY = "#FB2888";

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data" },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: PRIMARY },
        secondary: { main: SECONDARY },
      },
    },
    dark: {
      palette: {
        primary: { main: PRIMARY },
        secondary: { main: SECONDARY },
      },
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Noto Sans", system-ui, sans-serif',
  },
});
