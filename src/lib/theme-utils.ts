import {
  themeFromSourceColor,
  argbFromHex,
  hexFromArgb,
  CorePalette,
  Hct,
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
  outlineVariant: string;
  shadow: string;
}

export interface HCTColor {
  hue: number;
  chroma: number;
  tone: number;
  hex: string;
}

export interface M3SourceColors {
  primary: HCTColor;
  secondary?: HCTColor;
  tertiary?: HCTColor;
  error?: HCTColor;
  neutral?: HCTColor;
}

export function hexToHCT(hex: string): HCTColor {
  const hct = Hct.fromInt(parseInt(hex.slice(1), 16));
  return {
    hue: hct.hue,
    chroma: hct.chroma,
    tone: hct.tone,
    hex: hex,
  };
}

export function hctToHex(color: HCTColor): string {
  const hct = Hct.from(color.hue, color.chroma, color.tone);
  const argb = hct.toInt();
  return '#' + argb.toString(16).padStart(6, '0');
}

export function generateM3Colors(
  sources: Partial<M3SourceColors>,
  isDark: boolean
): M3Colors {
  // Ensure we have at least primary color
  if (!sources.primary?.hex) {
    sources.primary = hexToHCT("#6750A4"); // Default primary color
  }

  const baseTheme = themeFromSourceColor(argbFromHex(sources.primary.hex));
  const basePalette = CorePalette.of(argbFromHex(sources.primary.hex));
  const neutralPalette = sources.neutral 
    ? CorePalette.of(argbFromHex(sources.neutral.hex)).n1
    : basePalette.n1;

  if (sources.secondary?.hex) {
    basePalette.a2 = CorePalette.of(argbFromHex(sources.secondary.hex)).a1;
  }
  if (sources.tertiary?.hex) {
    basePalette.a3 = CorePalette.of(argbFromHex(sources.tertiary.hex)).a1;
  }
  if (sources.error?.hex) {
    basePalette.error = CorePalette.of(argbFromHex(sources.error.hex)).error;
  }

  const m3Theme = isDark ? baseTheme.schemes.dark : baseTheme.schemes.light;

  // Override background and surface colors with proper M3 tonal values
  const backgroundTone = isDark ? 6 : 99; // Updated light mode tone to 99 for proper M3 background
  const surfaceTone = isDark ? 10 : 96;   // Updated light mode tone to 96 for proper M3 surface
  
  const background = hexFromArgb(neutralPalette.tone(backgroundTone));
  const surface = hexFromArgb(neutralPalette.tone(surfaceTone));

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
    background,
    onBackground: hexFromArgb(m3Theme.onBackground),
    surface,
    onSurface: hexFromArgb(m3Theme.onSurface),
    surfaceVariant: hexFromArgb(m3Theme.surfaceVariant),
    onSurfaceVariant: hexFromArgb(m3Theme.onSurfaceVariant),
    outline: hexFromArgb(m3Theme.outline),
    outlineVariant: hexFromArgb(m3Theme.outlineVariant),
    shadow: hexFromArgb(m3Theme.shadow),
  };
}

export function ensureHCTColor(color: string | HCTColor | undefined): HCTColor {
  if (!color) {
    return hexToHCT("#6750A4"); // Default color
  }
  if (typeof color === 'string') {
    return hexToHCT(color);
  }
  return color;
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
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function loadThemeFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const saved = localStorage.getItem(key);
  return saved ? (JSON.parse(saved) as T) : null;
}
