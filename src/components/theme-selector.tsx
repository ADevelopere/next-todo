"use client"

import { useState } from "react"
import { Box, Grid2 as MuiGrid, Button, Typography, TextField, Tabs, Tab } from "@mui/material"
import { HexColorPicker } from "react-colorful"
import type { TodoTheme } from "@/src/lib/types"

interface ThemeSelectorProps {
  readonly currentTheme?: TodoTheme
  readonly cachedThemes: TodoTheme[]
  readonly onSelectTheme: (theme: TodoTheme) => void
}

export default function ThemeSelector({ currentTheme, cachedThemes, onSelectTheme }: ThemeSelectorProps) {
  const [tabValue, setTabValue] = useState(0)
  const [customTheme, setCustomTheme] = useState<TodoTheme>(
    currentTheme || {
      primary: "#1976d2",
      secondary: "#9c27b0",
      background: "#ffffff",
      name: "",
    },
  )
  const [activeColor, setActiveColor] = useState<"primary" | "secondary" | "background">("primary")

  const handleColorChange = (color: string) => {
    setCustomTheme({
      ...customTheme,
      [activeColor]: color,
    })
  }

  const handleApplyCustomTheme = () => {
    onSelectTheme(customTheme)
  }

  const handleApplyPageTheme = () => {
    onSelectTheme(customTheme);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} variant="fullWidth" sx={{ mb: 2 }}>
        <Tab label="Saved Themes" />
        <Tab label="Custom" />
      </Tabs>

      {tabValue === 0 && (
        <MuiGrid container spacing={2}>
          {cachedThemes.map((theme, index) => (
            <MuiGrid size={{ xs: 6 }} key={theme.name || index}>
              <Button
                onClick={() => onSelectTheme(theme)}
                sx={{
                  width: "100%",
                  height: 60,
                  display: "flex",
                  flexDirection: "column",
                  background: theme.background,
                  border: `1px solid ${theme.primary}`,
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: "50%",
                      height: "100%",
                      backgroundColor: theme.primary,
                    }}
                  />
                  <Box
                    sx={{
                      width: "50%",
                      height: "100%",
                      backgroundColor: theme.secondary,
                    }}
                  />
                </Box>
                {theme.name && (
                  <Typography variant="caption" sx={{ mt: 1, color: "text.primary" }}>
                    {theme.name}
                  </Typography>
                )}
              </Button>
            </MuiGrid>
          ))}
          {cachedThemes.length === 0 && (
            <MuiGrid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                No saved themes yet. Create a custom theme!
              </Typography>
            </MuiGrid>
          )}
        </MuiGrid>
      )}

      {tabValue === 1 && (
        <Box>
          <MuiGrid container spacing={2} sx={{ mb: 2 }}>
            <MuiGrid size={{ xs: 4 }}>
              <Button
                variant={activeColor === "primary" ? "contained" : "outlined"}
                onClick={() => setActiveColor("primary")}
                fullWidth
                sx={{
                  height: 40,
                  backgroundColor: activeColor === "primary" ? customTheme.primary : "transparent",
                  borderColor: customTheme.primary,
                  "&:hover": {
                    backgroundColor: activeColor === "primary" ? customTheme.primary : "transparent",
                    opacity: 0.8,
                  },
                }}
              >
                Primary
              </Button>
            </MuiGrid>
            <MuiGrid size={{ xs: 4 }}>
              <Button
                variant={activeColor === "secondary" ? "contained" : "outlined"}
                onClick={() => setActiveColor("secondary")}
                fullWidth
                sx={{
                  height: 40,
                  backgroundColor: activeColor === "secondary" ? customTheme.secondary : "transparent",
                  borderColor: customTheme.secondary,
                  "&:hover": {
                    backgroundColor: activeColor === "secondary" ? customTheme.secondary : "transparent",
                    opacity: 0.8,
                  },
                }}
              >
                Secondary
              </Button>
            </MuiGrid>
            <MuiGrid size={{ xs: 4 }}>
              <Button
                variant={activeColor === "background" ? "contained" : "outlined"}
                onClick={() => setActiveColor("background")}
                fullWidth
                sx={{
                  height: 40,
                  backgroundColor: activeColor === "background" ? customTheme.background : "transparent",
                  borderColor: customTheme.background,
                  "&:hover": {
                    backgroundColor: activeColor === "background" ? customTheme.background : "transparent",
                    opacity: 0.8,
                  },
                }}
              >
                Background
              </Button>
            </MuiGrid>
          </MuiGrid>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <HexColorPicker
              color={customTheme[activeColor]}
              onChange={handleColorChange}
              style={{ width: "100%", height: 150 }}
            />
          </Box>

          <TextField
            label={`${activeColor.charAt(0).toUpperCase() + activeColor.slice(1)} Color`}
            value={customTheme[activeColor]}
            onChange={(e) => handleColorChange(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleApplyCustomTheme}>
              Apply Theme
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleApplyPageTheme}>
              Apply Page Theme
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

