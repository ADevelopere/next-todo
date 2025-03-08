import { createTheme } from "@mui/material";
import type { M3Colors } from "./theme-utils";

export function createCustomTheme(mode: "light" | "dark", m3Colors: M3Colors) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: m3Colors.primary,
        contrastText: m3Colors.onPrimary,
        light: m3Colors.primaryContainer,
        dark: m3Colors.onPrimaryContainer,
      },
      secondary: {
        main: m3Colors.secondary,
        contrastText: m3Colors.onSecondary,
        light: m3Colors.secondaryContainer,
        dark: m3Colors.onSecondaryContainer,
      },
      error: {
        main: m3Colors.error,
        contrastText: m3Colors.onError,
        light: m3Colors.errorContainer,
        dark: m3Colors.onErrorContainer,
      },
      background: {
        default: m3Colors.background,
        paper: m3Colors.surface,
      },
      text: {
        primary: m3Colors.onSurface,
        secondary: m3Colors.onSurfaceVariant,
      },
    },
    // ...other theme customizations...
  });
}
