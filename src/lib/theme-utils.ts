import {
  themeFromSourceColor,
  argbFromHex,
  hexFromArgb,
  CorePalette,
} from "@material/material-color-utilities";

export interface M3Colors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  shadow: string;
}

export interface M3SourceColors {
  primary: string;
  secondary?: string;
  tertiary?: string;
  error?: string;
  neutral?: string;
}

export function generateM3Colors(
  sources: M3SourceColors,
  isDark: boolean
): M3Colors {
  // Generate base theme from primary
  const baseTheme = themeFromSourceColor(argbFromHex(sources.primary));
  const basePalette = CorePalette.of(argbFromHex(sources.primary));

  if (sources.secondary) {
    basePalette.a2 = CorePalette.of(argbFromHex(sources.secondary)).a1;
  }
  if (sources.tertiary) {
    basePalette.a3 = CorePalette.of(argbFromHex(sources.tertiary)).a1;
  }
  if (sources.error) {
    basePalette.error = CorePalette.of(argbFromHex(sources.error)).error;
  }

  const m3Theme = isDark ? baseTheme.schemes.dark : baseTheme.schemes.light;

  return {
    primary: hexFromArgb(m3Theme.primary),
    onPrimary: hexFromArgb(m3Theme.onPrimary),
    primaryContainer: hexFromArgb(m3Theme.primaryContainer),
    onPrimaryContainer: hexFromArgb(m3Theme.onPrimaryContainer),
    secondary: hexFromArgb(m3Theme.secondary),
    onSecondary: hexFromArgb(m3Theme.onSecondary),
    secondaryContainer: hexFromArgb(m3Theme.secondaryContainer),
    onSecondaryContainer: hexFromArgb(m3Theme.onSecondaryContainer),
    tertiary: hexFromArgb(m3Theme.tertiary),
    onTertiary: hexFromArgb(m3Theme.onTertiary),
    tertiaryContainer: hexFromArgb(m3Theme.tertiaryContainer),
    onTertiaryContainer: hexFromArgb(m3Theme.onTertiaryContainer),
    error: hexFromArgb(m3Theme.error),
    onError: hexFromArgb(m3Theme.onError),
    errorContainer: hexFromArgb(m3Theme.errorContainer),
    onErrorContainer: hexFromArgb(m3Theme.onErrorContainer),
    background: hexFromArgb(m3Theme.background),
    onBackground: hexFromArgb(m3Theme.onBackground),
    surface: hexFromArgb(m3Theme.surface),
    onSurface: hexFromArgb(m3Theme.onSurface),
    surfaceVariant: hexFromArgb(m3Theme.surfaceVariant),
    onSurfaceVariant: hexFromArgb(m3Theme.onSurfaceVariant),
    outline: hexFromArgb(m3Theme.outline),
    shadow: hexFromArgb(m3Theme.shadow),
  };
}

export type ThemeMode = "light" | "dark";
export type StorageTheme = {
  mode: ThemeMode;
  sourceColor: string;
  savedThemes: M3Colors[];
};

export type SavedTheme = {
  name: string;
  sources: M3SourceColors;
};

export function saveThemeToStorage(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadThemeFromStorage<T>(key: string): T | null {
  const saved = localStorage.getItem(key);
  return saved ? (JSON.parse(saved) as T) : null;
}
