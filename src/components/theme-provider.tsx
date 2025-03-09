"use client";

import * as React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  Theme,
} from "@mui/material";
import { createCustomTheme } from "@/src/lib/theme-config";
import {
  generateM3Colors,
  saveThemeToStorage,
  loadThemeFromStorage,
  hexToHCT,
} from "@/src/lib/theme-utils";
import type {
  M3Colors,
  ThemeMode,
  M3SourceColors,
} from "@/src/lib/theme-utils";

// Initial default colors
const defaultSourceColors: M3SourceColors = {
  primary: hexToHCT("#6750A4"),
  secondary: hexToHCT("#958DA5"),
  tertiary: hexToHCT("#B58392"),
  error: hexToHCT("#B3261E"),
  neutral: hexToHCT("#1C1B1F"), // Added neutral color for better background tones
};

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  sourceColor: string;
  setSourceColor: (color: string) => void;
  m3Colors: M3Colors;
  theme: Theme;
  sourceColors: M3SourceColors;
  setSourceColors: (colors: M3SourceColors) => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  initialMode = "light",
  setTheme,
}: Readonly<{
  children: React.ReactNode;
  initialMode?: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}>) {
  const [mode, setMode] = React.useState<ThemeMode>(initialMode);
  const [sourceColor, setSourceColor] = React.useState<string>("#1976d2");
  const [sourceColors, setSourceColors] =
    React.useState<M3SourceColors>(defaultSourceColors);

  // Load saved theme data only once on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = loadThemeFromStorage<ThemeMode>("themeMode");
      const savedSourceColors =
        loadThemeFromStorage<M3SourceColors>("sourceColors");

      if (savedMode) setMode(savedMode);
      if (savedSourceColors?.primary) {
        setSourceColors(savedSourceColors);
      }
    }
  }, [setMode, setSourceColors]);

  // Memoize colors to prevent unnecessary updates
  const m3Colors = React.useMemo(
    () => generateM3Colors(sourceColors, mode === "dark"),
    [sourceColors, mode]
  );

  // Save theme changes to localStorage
  React.useEffect(() => {
    saveThemeToStorage("themeMode", mode);
    saveThemeToStorage("sourceColor", sourceColor);
    saveThemeToStorage("sourceColors", sourceColors);
  }, [mode, sourceColor, sourceColors]);

  const theme = React.useMemo(
    () => createCustomTheme(mode, m3Colors),
    [mode, m3Colors]
  );

  const contextValue = React.useMemo(
    () => ({
      mode,
      setMode: (mode: ThemeMode) => {
        setMode(mode);
        setTheme(mode);
      },
      sourceColor,
      setSourceColor,
      sourceColors,
      setSourceColors,
      m3Colors,
      theme,
    }),
    [mode, sourceColor, sourceColors, m3Colors, theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
