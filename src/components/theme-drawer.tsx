"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Grid2 as MuiGrid,
  IconButton,
  useTheme
} from "@mui/material";
import { Close, Delete, Edit } from "@mui/icons-material";
import type { TodoTheme } from "@/src/lib/types";
import { useThemeContext } from "./theme-provider";
import type { M3SourceColors, HCTColor } from "@/src/lib/theme-utils";
import HCTColorPicker from "./hct-color-picker";
import CoreColors from "./core-colors";
import { hexToHCT } from "@/src/lib/theme-utils";
import { saveToLocalStorage } from "@/src/lib/storage"
interface ThemeDrawerProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly cachedThemes: TodoTheme[];
  readonly onUpdateThemes: (themes: TodoTheme[]) => void;
}

export default function ThemeDrawer({
  open,
  onClose,
  cachedThemes,
  onUpdateThemes,
}: ThemeDrawerProps) {
  const muiTheme = useTheme();
  const { sourceColors, setSourceColors, m3Colors } = useThemeContext();
  const [activeColor, setActiveColor] = useState<keyof M3SourceColors>("primary");
  const [editingTheme, setEditingTheme] = useState<TodoTheme | null>(null);
  const [colorMatchEnabled, setColorMatchEnabled] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  // Initialize colors once when drawer opens
  useEffect(() => {
    if (open && !sourceColors.primary) {
      setSourceColors({
        primary: hexToHCT("#6750A4"),
        secondary: hexToHCT("#958DA5"),
        tertiary: hexToHCT("#B58392"),
        error: hexToHCT("#B3261E"),
        neutral: hexToHCT("#939094"),
      });
    }
  }, [open]);

  const handleColorChange = (color: HCTColor) => {
    setSourceColors({
      ...sourceColors,
      [activeColor]: color,
    });
  };

  const handleClose = () => {
    const newTheme: TodoTheme = {
      name: editingTheme?.name ?? `Theme ${cachedThemes.length + 1}`,
      sources: sourceColors,
      primary: hexToHCT(m3Colors.primary),
      secondary: hexToHCT(m3Colors.secondary),
      background: hexToHCT(m3Colors.background),
    };

    if (editingTheme) {
      onUpdateThemes(
        cachedThemes.map((t) => (t.name === editingTheme.name ? newTheme : t))
      );
    } else {
      onUpdateThemes([...cachedThemes, newTheme]);
    }

    saveToLocalStorage("cachedThemes", cachedThemes);
    onClose();
  };

  const handleDeleteTheme = (index: number) => {
    const updatedThemes = cachedThemes.filter((_, i) => i !== index);
    onUpdateThemes(updatedThemes);
    saveToLocalStorage("cachedThemes", updatedThemes);
  };

  const handleEditTheme = (theme: TodoTheme) => {
    setEditingTheme(theme);
    setSourceColors(theme.sources); // Use source colors from theme
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: { 
            width: { xs: "100%", sm: 400 },
            backgroundColor: muiTheme.palette.background.default,
            color: muiTheme.palette.text.primary,
          },
        },
      }}
    >
      <Box sx={{ 
        p: 3,
        bgcolor: m3Colors.surface,
        color: m3Colors.onSurface,
        minHeight: '100%'
      }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: m3Colors.onSurface }}>Theme Customization</Typography>
          <IconButton onClick={handleClose} sx={{ color: m3Colors.onSurfaceVariant }}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3, bgcolor: m3Colors.outlineVariant }} />

        <CoreColors
          colors={sourceColors}
          colorMatchEnabled={colorMatchEnabled}
          onColorMatchChange={setColorMatchEnabled}
          onColorSelect={(color: keyof M3SourceColors) => {
            setActiveColor(color);
            setColorPickerOpen(true);
          }}
          selectedColor={activeColor}
        />

        <HCTColorPicker
          open={colorPickerOpen}
          initialColor={sourceColors[activeColor] ?? hexToHCT("#6750A4")}
          onColorChange={handleColorChange}
          onApply={(color: HCTColor) => {
            handleColorChange(color);
            setColorPickerOpen(false);
          }}
          onCancel={() => setColorPickerOpen(false)}
        />

        <Divider sx={{ my: 3, bgcolor: m3Colors.outlineVariant }} />
        <Typography variant="subtitle1" gutterBottom sx={{ color: m3Colors.onSurface }}>
          Recent Themes
        </Typography>
        <MuiGrid container spacing={2}>
          {cachedThemes.map((theme, index) => (
            <MuiGrid size={{ xs: 12 }} key={theme.name ?? index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  border: 1,
                  borderColor: m3Colors.outlineVariant,
                  borderRadius: 1,
                  bgcolor: m3Colors.surfaceVariant,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flex: 1,
                  }}
                >
                  {["primary", "secondary", "background"].map((color) => (
                    <Box
                      key={color}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor:
                          theme.sources[color as keyof M3SourceColors]?.hex ?? '#000000',
                      }}
                    />
                  ))}
                  <Typography sx={{ ml: 1, color: m3Colors.onSurfaceVariant }}>
                    {theme.name ?? "Unnamed Theme"}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleEditTheme(theme)}
                    sx={{ color: m3Colors.onSurfaceVariant }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTheme(index)}
                    sx={{ color: m3Colors.onSurfaceVariant }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </MuiGrid>
          ))}
        </MuiGrid>
      </Box>
    </Drawer>
  );
}
