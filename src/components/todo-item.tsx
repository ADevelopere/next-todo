"use client"

import type React from "react"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { format } from "date-fns"
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  IconButton,
  ThemeProvider,
  createTheme,
  Collapse,
  Tooltip,
  Popover,
  Divider,
  useTheme as useMuiTheme,
} from "@mui/material"
import { DragIndicator, ExpandMore, ExpandLess, Delete, ContentCopy, Palette } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers"
import type { Todo, TodoTheme } from "@/src/lib/types"
import ThemeSelector from "./theme-selector"
import EditableTypography from "@/src/components/ui/EditableTypography"

interface TodoItemProps {
  todo: Todo
  onUpdate: (todo: Todo) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onToggleSelect: (id: string) => void
  isSelected: boolean
  cachedThemes: TodoTheme[]
  onSaveTheme: (theme: TodoTheme) => void
}

export default function TodoItem({
  todo,
  onUpdate,
  onDelete,
  onDuplicate,
  onToggleSelect,
  isSelected,
  cachedThemes,
  onSaveTheme,
  doubleClickToEdit = false,
  onSave,
  onCancel,
  startEditing = false,
}: Readonly<TodoItemProps> & { doubleClickToEdit?: boolean; onSave?: (value: string) => void; onCancel?: () => void; startEditing?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [themeAnchorEl, setThemeAnchorEl] = useState<HTMLButtonElement | null>(null)
  const systemTheme = useMuiTheme()

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const todoTheme = createTheme({
    palette: {
      mode: systemTheme.palette.mode,
      primary: {
        main: todo.theme?.primary.hex ?? systemTheme.palette.primary.main,
      },
      secondary: {
        main: todo.theme?.secondary.hex ?? systemTheme.palette.secondary.main,
      },
      background: {
        default: todo.theme?.background.hex ?? systemTheme.palette.background.default,
      },
    },
  })

  const handleTitleChange = async (value: string) => {
    onUpdate({ ...todo, title: value })
    if (onSave) {
      onSave(value)
    }
  }

  const handleDescriptionChange = async (value: string) => {
    onUpdate({ ...todo, description: value })
  }

  const handleCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...todo, completed: e.target.checked })
  }

  const handleDateChange = (date: Date | null) => {
    onUpdate({ ...todo, dueDate: date ? date.toISOString() : null })
  }

  const handleThemeChange = (newTheme: TodoTheme) => {
    onUpdate({ ...todo, theme: newTheme })
    onSaveTheme(newTheme)
    setThemeAnchorEl(null)
  }

  const openThemeSelector = (event: React.MouseEvent<HTMLButtonElement>) => {
    setThemeAnchorEl(event.currentTarget)
  }

  const closeThemeSelector = () => {
    setThemeAnchorEl(null)
  }

  const themeOpen = Boolean(themeAnchorEl)

  return (
    <ThemeProvider theme={todoTheme}>
      <Paper
        ref={setNodeRef}
        style={style}
        elevation={3}
        sx={{
          p: 2,
          borderLeft: todo.theme ? `6px solid ${todo.theme.primary.hex}` : undefined,
          opacity: todo.completed ? 0.7 : 1,
          transition: "all 0.2s ease",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton {...attributes} {...listeners} size="small" sx={{ cursor: "grab", mr: 1 }}>
            <DragIndicator />
          </IconButton>

          <Checkbox checked={isSelected} onChange={() => onToggleSelect(todo.id)} size="small" sx={{ mr: 1 }} />

          <Checkbox checked={todo.completed} onChange={handleCompletedChange} color="primary" sx={{ mr: 1 }} />

          <EditableTypography
            typography={{ variant: "body1", sx: { textDecoration: todo.completed ? "line-through" : "none" } }}
            textField={{ variant: "standard", fullWidth: true }}
            onSave={handleTitleChange}
            value={todo.title}
            doubleClickToEdit={doubleClickToEdit}
            startEditing={startEditing}
            onCancel={onCancel}
          />

          <Box sx={{ display: "flex", ml: "auto" }}>
            <Tooltip title="Theme">
              <IconButton size="small" onClick={openThemeSelector}>
                <Palette fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Duplicate">
              <IconButton size="small" onClick={() => onDuplicate(todo.id)}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => onDelete(todo.id)}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={expanded ? "Collapse" : "Expand"}>
              <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <EditableTypography
              typography={{ variant: "body2" }}
              textField={{ variant: "outlined", fullWidth: true, multiline: true, rows: 3 }}
              onSave={handleDescriptionChange}
              value={todo.description}
            />

            <DatePicker
              label="Due Date"
              value={todo.dueDate ? new Date(todo.dueDate) : null}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, variant: "outlined" } }}
            />

            {todo.createdAt && (
              <Typography variant="caption" display="block" sx={{ mt: 2, color: "text.secondary" }}>
                Created: {format(new Date(todo.createdAt), "PPP")}
              </Typography>
            )}
          </Box>
        </Collapse>

        <Popover
          open={themeOpen}
          anchorEl={themeAnchorEl}
          onClose={closeThemeSelector}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box sx={{ p: 2, width: 300 }}>
            <Typography variant="subtitle1" gutterBottom>
              Choose a theme
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ThemeSelector currentTheme={todo.theme} cachedThemes={cachedThemes} onSelectTheme={handleThemeChange} />
          </Box>
        </Popover>
      </Paper>
    </ThemeProvider>
  )
}

