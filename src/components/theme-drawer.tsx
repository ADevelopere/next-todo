"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Grid2 as MuiGrid,
  IconButton,
} from "@mui/material";
import { Close, Delete, Edit } from "@mui/icons-material";
import { HexColorPicker } from "react-colorful";
import type { TodoTheme } from "@/src/lib/types";
import { useThemeContext } from "./theme-provider";
import type { M3SourceColors } from "@/src/lib/theme-utils";

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
  const { sourceColors, setSourceColors, m3Colors } = useThemeContext();
  const [activeColor, setActiveColor] =
    useState<keyof M3SourceColors>("primary");
  const [editingTheme, setEditingTheme] = useState<TodoTheme | null>(null);
  const [themeName, setThemeName] = useState("");

  useEffect(() => {
    if (open) {
      setEditingTheme(null);
      setThemeName("");
    }
  }, [open]);

  const handleColorChange = (color: string) => {
    setSourceColors({
      ...sourceColors,
      [activeColor]: color,
    });
  };

  const handleClose = () => {
    if (themeName) {
      const newTheme: TodoTheme = {
        name: themeName,
        sources: sourceColors,
        primary: m3Colors.primary,
        secondary: m3Colors.secondary,
        background: m3Colors.background,
      };

      if (editingTheme) {
        onUpdateThemes(
          cachedThemes.map((t) => (t.name === editingTheme.name ? newTheme : t))
        );
      } else {
        onUpdateThemes([...cachedThemes, newTheme]);
      }
    }
    onClose();
  };

  const handleDeleteTheme = (index: number) => {
    onUpdateThemes(cachedThemes.filter((_, i) => i !== index));
  };

  const handleEditTheme = (theme: TodoTheme) => {
    setEditingTheme(theme);
    setSourceColors(theme.sources); // Use source colors from theme
    setThemeName(theme.name ?? "");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: { width: { xs: "100%", sm: 400 } },
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Theme Customization</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <TextField
          label="Theme Name (optional)"
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <MuiGrid container spacing={2} sx={{ mt: 1, mb: 2 }}>
          {(["primary", "secondary", "tertiary", "error"] as const).map(
            (color) => (
              <MuiGrid size={{ xs: 3 }} key={color}>
                <Button
                  onClick={() => setActiveColor(color)}
                  fullWidth
                  sx={{
                    textTransform: "capitalize",
                    color:
                      activeColor === color ? "primary.main" : "text.secondary",
                  }}
                >
                  {color}
                </Button>
              </MuiGrid>
            )
          )}
        </MuiGrid>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <HexColorPicker
            color={sourceColors[activeColor] ?? "#000000"}
            onChange={handleColorChange}
            style={{ width: "100%", height: 200 }}
          />
        </Box>

        <TextField
          value={sourceColors[activeColor] ?? "#000000"}
          onChange={(e) => handleColorChange(e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
        />

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
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
                  borderColor: "divider",
                  borderRadius: 1,
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
                          theme.sources[color as keyof M3SourceColors],
                      }}
                    />
                  ))}
                  <Typography sx={{ ml: 1 }}>
                    {theme.name ?? "Unnamed Theme"}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleEditTheme(theme)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTheme(index)}
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
