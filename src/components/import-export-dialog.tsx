"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Alert,
} from "@mui/material"
import type { Todo } from "@/src/lib/types"

interface ImportExportDialogProps {
  open: boolean
  onClose: () => void
  onImport: (todos: Todo[]) => void
  onExport: () => Todo[]
}

export default function ImportExportDialog({ open, onClose, onImport, onExport }: ImportExportDialogProps) {
  const [tabValue, setTabValue] = useState(0)
  const [importData, setImportData] = useState("")
  const [importError, setImportError] = useState("")
  const [exportData, setExportData] = useState("")

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    if (newValue === 1) {
      // Generate export data when switching to export tab
      const data = JSON.stringify(onExport(), null, 2)
      setExportData(data)
    }
  }

  const handleImport = () => {
    try {
      setImportError("")
      const data = JSON.parse(importData)

      // Validate the imported data
      if (!Array.isArray(data)) {
        throw new Error("Imported data must be an array")
      }

      const validTodos: Todo[] = []

      for (const item of data) {
        if (typeof item !== "object" || item === null) {
          throw new Error("Each todo must be an object")
        }

        if (typeof item.title !== "string") {
          throw new Error("Each todo must have a title property of type string")
        }

        // Create a valid todo with required fields
        const validTodo: Todo = {
          id: item.id || crypto.randomUUID(),
          title: item.title,
          completed: Boolean(item.completed),
          description: typeof item.description === "string" ? item.description : "",
          dueDate: typeof item.dueDate === "string" ? item.dueDate : null,
          createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
          theme: item.theme
            ? {
                primary: typeof item.theme.primary === "string" ? item.theme.primary : "#1976d2",
                secondary: typeof item.theme.secondary === "string" ? item.theme.secondary : "#9c27b0",
                background: typeof item.theme.background === "string" ? item.theme.background : "#ffffff",
                name: typeof item.theme.name === "string" ? item.theme.name : "",
              }
            : undefined,
        }

        validTodos.push(validTodo)
      }

      onImport(validTodos)
      setImportData("")
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Invalid JSON format")
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportData)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import/Export Todos</DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Import" />
          <Tab label="Export" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Paste your JSON data below to import todos. The data should be an array of todo objects.
            </Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder='[
  {
    "title": "Example Todo",
    "completed": false,
    "description": "This is an example todo item",
    "dueDate": null
  }
]'
              variant="outlined"
              sx={{ mt: 2 }}
            />
            {importError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {importError}
              </Alert>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Copy the JSON data below to export your todos.
            </Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              value={exportData}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <Button variant="outlined" onClick={handleCopyToClipboard} sx={{ mt: 2 }}>
              Copy to Clipboard
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {tabValue === 0 && (
          <Button onClick={handleImport} variant="contained" color="primary">
            Import
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

