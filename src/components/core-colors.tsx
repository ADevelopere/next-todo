import { Box, Switch, Typography, FormControlLabel } from "@mui/material";
import type { M3SourceColors } from "@/src/lib/theme-utils";
import { hctToHex } from "@/src/lib/theme-utils"; // Import the hctToHex function

interface CoreColorsProps {
  readonly colors: M3SourceColors;
  readonly colorMatchEnabled: boolean;
  readonly onColorMatchChange: (enabled: boolean) => void;
  readonly onColorSelect: (colorKey: keyof M3SourceColors) => void;
  readonly selectedColor: keyof M3SourceColors;
}

export default function CoreColors({
  colors,
  colorMatchEnabled,
  onColorMatchChange,
  onColorSelect,
  selectedColor,
}: CoreColorsProps) {
  return (
    <Box>
      <Typography variant="h6">Core Colors</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Override or set key colors that will be used to generate tonal palettes
        and schemes.
      </Typography>

      <Box sx={{ display: "grid", gap: 2 }}>
        {(Object.keys(colors) as Array<keyof M3SourceColors>).map((key) => (
          <Box
            key={key}
            onClick={() => onColorSelect(key)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              p: 1,
              borderRadius: 1,
              bgcolor:
                selectedColor === key ? "action.selected" : "transparent",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: colors[key]
                  ? hctToHex(colors[key])
                  : "transparent",
              }}
            />
            <Box>
              <Typography sx={{ textTransform: "capitalize" }}>
                {key}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Acts as custom source color
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={colorMatchEnabled}
            onChange={(e) => onColorMatchChange(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            Color match
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              Stay true to my color inputs
            </Typography>
          </Typography>
        }
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
