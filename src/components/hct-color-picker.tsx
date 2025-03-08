import { Box, Slider, TextField, Button, Typography, Dialog, useTheme } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { Hct } from '@material/material-color-utilities';
import { HCTColor } from '@/src/lib/theme-utils';

// Custom styles for the color picker
const colorPickerStyles = {
  dialog: {
    '& .MuiDialog-paper': {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: '#ffffff',
      borderRadius: 3,
      padding: '28px 32px',
      maxWidth: '460px'
    }
  },
  title: {
    textAlign: 'center',
    marginBottom: 3
  },
  icon: {
    fontSize: '2.5rem',
    marginBottom: 1,
    display: 'block'
  },
  titleText: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#ffffff'
  },
  hexInput: {
    marginBottom: 4,         // Increased margin
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 1,
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      }
    },
    '& input': {
      color: '#ffffff',
      padding: '12px',
    },
    '& label': {
      color: '#ffffff',
      marginBottom: 0.5,
    }
  },
  sliderGroup: {
    marginBottom: 3,
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    alignItems: 'center',
    gap: 2
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1
  },
  valueContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 1
  },
  slider: {
    flex: 1,
    marginRight: 1.25,
    padding: '0 !important', // Remove default padding
    height: 28, // Increased height to contain thumb
    '& .MuiSlider-track': {
      display: 'none', // Hide default track
    },
    '& .MuiSlider-thumb': {
      width: 20,
      height: 20,
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      '&:hover, &.Mui-active': {
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }
    },
    '& .MuiSlider-rail': {
      height: '100%', // Make rail full height
      borderRadius: '4px',
      opacity: 1,
      position: 'relative',
      top: '4px', // Center rail vertically within the custom track
    }
  },
  valueBox: {
    width: 120,             // Increased width for better number display
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 1,
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }
    },
    '& input': {
      color: '#ffffff',
      padding: '8px 12px',
      fontSize: '0.875rem',
      textAlign: 'right',
    }
  },
  label: {
    color: '#ffffff',
    marginBottom: 1,
    fontSize: '0.875rem',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '24px 0 0 0',  // Increased top padding
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: 4,           // Increased margin
    '& .MuiButton-root': {
      textTransform: 'none',
      fontSize: '0.875rem',
      padding: '6px 16px',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
      }
    }
  }
};

interface HCTColorPickerProps {
  readonly open: boolean;
  readonly initialColor: HCTColor;
  readonly onColorChange?: (color: HCTColor) => void;
  readonly onApply: (color: HCTColor) => void;
  readonly onCancel: () => void;
}

export default function HCTColorPicker({
  open,
  initialColor: initColor,
  onColorChange,
  onApply,
  onCancel,
}: HCTColorPickerProps) {
  const theme = useTheme();
  const [color, setColor] = useState<HCTColor>({
    hue: 98.2153894,
    chroma: 57.554663,
    tone: 88.856952,
    hex: initColor.hex
  });

  useEffect(() => {
    if (initColor) {
      setColor(initColor);
    }
  }, [initColor.hex]);

  const updateColor = useCallback((newColor: Partial<HCTColor>) => {
    if (!color) return;
    
    const hct = Hct.from(
      newColor.hue ?? color.hue,
      newColor.chroma ?? color.chroma,
      newColor.tone ?? color.tone
    );
    
    const updatedColor: HCTColor = {
      hue: newColor.hue ?? color.hue,
      chroma: newColor.chroma ?? color.chroma,
      tone: newColor.tone ?? color.tone,
      hex: '#' + hct.toInt().toString(16).padStart(6, '0')
    };
    
    setColor(updatedColor);
    onColorChange?.(updatedColor);
  }, [color, onColorChange]);

  const handleHueChange = (_: Event, value: number | number[]) => {
    updateColor({ hue: value as number });
  };

  const handleChromaChange = (_: Event, value: number | number[]) => {
    updateColor({ chroma: value as number });
  };

  const handleToneChange = (_: Event, value: number | number[]) => {
    updateColor({ tone: value as number });
  };

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hex = event.target.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      const hct = Hct.fromInt(parseInt(hex.slice(1), 16));
      const newColor: HCTColor = {
        hue: hct.hue,
        chroma: hct.chroma,
        tone: hct.tone,
        hex
      };
      setColor(newColor);
      onColorChange?.(newColor);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth sx={{
      ...colorPickerStyles.dialog,
      '& .MuiDialog-paper': {
        ...colorPickerStyles.dialog['& .MuiDialog-paper'],
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }
    }}>
      <Box sx={colorPickerStyles.title}>
        <Typography sx={colorPickerStyles.icon}>🎨</Typography>
        <Typography sx={colorPickerStyles.titleText}>HCT Color Picker</Typography>
      </Box>

      <Box sx={colorPickerStyles.sliderGroup}>
        <Typography sx={colorPickerStyles.label}>Hex Color</Typography>
        <TextField
          value={color.hex}
          onChange={handleHexChange}
          fullWidth
          size="small"
          sx={{
            ...colorPickerStyles.hexInput,
            '& .MuiOutlinedInput-root': {
              ...colorPickerStyles.hexInput['& .MuiOutlinedInput-root'],
              backgroundColor: theme.palette.background.paper,
              '& fieldset': {
                borderColor: theme.palette.divider,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.text.secondary,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              }
            },
            '& input': {
              color: theme.palette.text.primary,
            },
            '& label': {
              color: theme.palette.text.secondary,
            }
          }}
        />
      </Box>

      <Box sx={colorPickerStyles.sliderGroup}>
        <Typography sx={colorPickerStyles.label}>Hue</Typography>
        <Box sx={colorPickerStyles.sliderContainer}>
          <Box sx={colorPickerStyles.valueContainer}>
            <TextField
              value={color.hue.toFixed(6)}
              size="small"
              sx={colorPickerStyles.valueBox}
              slotProps={{ htmlInput: { readOnly: true } }}
            />
          </Box>
          <Slider
            value={color.hue}
            onChange={handleHueChange}
            min={0}
            max={360}
            sx={{
              ...colorPickerStyles.slider,
              padding: '4px', // Add padding to the box
              '& .MuiSlider-rail': {
                background: 'linear-gradient(to right, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                height: '28px', // Custom track height
                borderRadius: '4px'
              },
              '& .MuiSlider-thumb': {
                width: 20,
                height: 20,
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                '&:before': {
                  boxShadow: 'none'
                }
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={colorPickerStyles.sliderGroup}>
        <Typography sx={colorPickerStyles.label}>Chroma</Typography>
        <Box sx={colorPickerStyles.sliderContainer}>
          <Box sx={colorPickerStyles.valueContainer}>
            <TextField
              value={color.chroma.toFixed(6)}
              size="small"
              sx={colorPickerStyles.valueBox}
              slotProps={{ htmlInput: { readOnly: true } }}
            />
          </Box>
          <Slider
            value={color.chroma}
            onChange={handleChromaChange}
            min={0}
            max={150}
            sx={{
              ...colorPickerStyles.slider,
              padding: '4px', // Add padding to the box
              '& .MuiSlider-rail': {
                background: `linear-gradient(to right, #808080, ${color.hex})`,
                height: '28px', // Custom track height
                borderRadius: '4px'
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={colorPickerStyles.sliderGroup}>
        <Typography sx={colorPickerStyles.label}>Tone</Typography>
        <Box sx={colorPickerStyles.sliderContainer}>
          <Box sx={colorPickerStyles.valueContainer}>
            <TextField
              value={color.tone.toFixed(6)}
              size="small"
              sx={colorPickerStyles.valueBox}
              slotProps={{ htmlInput: { readOnly: true } }}
            />
          </Box>
          <Slider
            value={color.tone}
            onChange={handleToneChange}
            min={0}
            max={100}
            sx={{
              ...colorPickerStyles.slider,
              padding: '4px', // Add padding to the box
              '& .MuiSlider-rail': {
                background: `linear-gradient(to right, #000000, ${color.hex}, #ffffff)`,
                height: '28px', // Custom track height
                borderRadius: '4px'
              },
              '& .MuiSlider-thumb': {
                backgroundColor: color.tone > 50 ? '#000000' : '#ffffff'
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={colorPickerStyles.buttons}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onApply(color)}>Apply</Button>
      </Box>
    </Dialog>
  );
}
