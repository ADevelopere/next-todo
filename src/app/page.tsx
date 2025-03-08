"use client"

import { useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, UniqueIdentifier, Over } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { v4 as uuidv4 } from "uuid"
import { useSnackbar } from "notistack"
import { Box, Container, Typography, Button, Fab, Divider } from "@mui/material"
import { Add as AddIcon, DarkMode, LightMode, Settings } from "@mui/icons-material"
import { useThemeContext } from "@/src/components/theme-provider"

import TodoItem from "@/src/components/todo-item"
import ThemeDrawer from "@/src/components/theme-drawer"
import ImportExportDialog from "@/src/components/import-export-dialog"
import ParticleBackground from "@/src/components/particle-background"
import type { Todo, TodoTheme } from "@/src/lib/types"
import { saveToLocalStorage, loadFromLocalStorage } from "@/src/lib/storage"

export default function Home() {
  const { mode, setMode, m3Colors } = useThemeContext()
  const [todos, setTodos] = useState<Todo[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [importExportOpen, setImportExportOpen] = useState(false)
  const [selectedTodos, setSelectedTodos] = useState<string[]>([])
  const [cachedThemes, setCachedThemes] = useState<TodoTheme[]>([])
  const { enqueueSnackbar } = useSnackbar()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    const savedTodos = loadFromLocalStorage("todos")
    const savedThemes = loadFromLocalStorage("cachedThemes")

    if (savedTodos) setTodos(savedTodos)
    if (savedThemes) setCachedThemes(savedThemes)
  }, [])

  useEffect(() => {
    saveToLocalStorage("todos", todos)
  }, [todos])

  useEffect(() => {
    saveToLocalStorage("cachedThemes", cachedThemes)
  }, [cachedThemes])

  interface DragEndEvent {
    active: { id: UniqueIdentifier }
    over: Over | null
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })

      enqueueSnackbar("Todo reordered successfully", { variant: "success" })
    }
  }

  const addTodo = () => {
    const newTodo: Todo = {
      id: uuidv4(),
      title: "New Todo",
      completed: false,
      description: "",
      dueDate: null,
      theme: cachedThemes.length > 0 ? { ...cachedThemes[0] } : undefined,
      createdAt: new Date().toISOString(),
    }

    setTodos([...todos, newTodo])
    enqueueSnackbar("New todo added", { variant: "success" })
  }

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
    enqueueSnackbar("Todo deleted", { variant: "success" })
  }

  const duplicateTodo = (id: string) => {
    const todoToDuplicate = todos.find((todo) => todo.id === id)
    if (todoToDuplicate) {
      const duplicatedTodo: Todo = {
        ...todoToDuplicate,
        id: uuidv4(),
        title: `${todoToDuplicate.title} (Copy)`,
        createdAt: new Date().toISOString(),
      }
      setTodos([...todos, duplicatedTodo])
      enqueueSnackbar("Todo duplicated", { variant: "success" })
    }
  }

  const toggleTodoSelection = (id: string) => {
    setSelectedTodos((prev) => (prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]))
  }

  const saveTheme = (theme: TodoTheme) => {
    if (
      !cachedThemes.some(
        (t) => t.primary === theme.primary && t.secondary === theme.secondary && t.background === theme.background,
      )
    ) {
      setCachedThemes([...cachedThemes, theme])
    }
  }

  const handleImport = (importedTodos: Todo[]) => {
    setTodos([...todos, ...importedTodos])
    enqueueSnackbar(`Imported ${importedTodos.length} todos`, { variant: "success" })
    setImportExportOpen(false)
  }

  const handleExport = () => {
    const todosToExport = selectedTodos.length > 0 ? todos.filter((todo) => selectedTodos.includes(todo.id)) : todos

    return todosToExport
  }

  const handleThemeSwitch = () => {
    setMode(mode === "dark" ? "light" : "dark")
  }

  const updateCachedThemes = (themes: TodoTheme[]) => {
    setCachedThemes(themes)
    saveToLocalStorage("cachedThemes", themes)
  }

  const [tempTodo, setTempTodo] = useState<Todo>({
    id: "temp",
    title: "",
    completed: false,
    description: "",
    dueDate: null,
    theme: {
      name: "Temporary",
      sources: {
        primary: { hue: 0, chroma: 0, tone: 80, hex: "#B0B0B0" },
        secondary: { hue: 0, chroma: 0, tone: 90, hex: "#D3D3D3" },
      },
      primary: { hue: 0, chroma: 0, tone: 80, hex: "#B0B0B0" },
      secondary: { hue: 0, chroma: 0, tone: 90, hex: "#D3D3D3" },
      background: { hue: 0, chroma: 0, tone: 95, hex: "#F0F0F0" },
    },
    createdAt: new Date().toISOString(),
  });

  // Add a key to force re-render of temp todo
  const [tempTodoKey, setTempTodoKey] = useState(0);

  const handleTempTodoChange = (updatedTempTodo: Todo) => {
    setTempTodo(updatedTempTodo);
  };

  const handleTempTodoSave = (value: string) => {
    if (value.trim() !== "") {
      const newTodo: Todo = {
        id: uuidv4(),
        title: value,
        completed: false,
        description: "",
        dueDate: null,
        theme: cachedThemes.length > 0 ? { ...cachedThemes[0] } : undefined,
        createdAt: new Date().toISOString(),
      };

      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setTempTodo((prev) => ({
        ...prev,
        title: "",
        description: "",
      }));
      // Increment key to force re-render and reset edit state
      setTempTodoKey(prev => prev + 1);
      enqueueSnackbar("New todo added", { variant: "success" });
    }
  };

  const handleTempTodoCancel = () => {
    setTempTodo((prev) => ({
      ...prev,
      title: "",
      description: "",
    }));
    // Increment key to force re-render and reset edit state
    setTempTodoKey(prev => prev + 1);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden", bgcolor: m3Colors.background }}>
      <ParticleBackground particleColor={m3Colors.primary} />

      <Container maxWidth="md" sx={{ py: 4, position: "relative", zIndex: 1, bgcolor: m3Colors.surface, borderRadius: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, p: 2, borderRadius: 1 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color={m3Colors.primary}>
            Themed Todo App
          </Typography>

          <Box>
            <Button variant="outlined" onClick={() => setImportExportOpen(true)} sx={{ mr: 1 }}>
              Import/Export
            </Button>

            <Button
              variant="outlined"
              onClick={handleThemeSwitch}
              startIcon={mode === "dark" ? <LightMode /> : <DarkMode />}
            >
              {mode === "dark" ? "Light" : "Dark"}
            </Button>
          </Box>
        </Box>
        <Divider sx={{ mb: 4, bgcolor: m3Colors.outlineVariant }} />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={[...todos.map((t) => t.id), tempTodo.id]} strategy={verticalListSortingStrategy}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                  onDuplicate={duplicateTodo}
                  onToggleSelect={toggleTodoSelection}
                  isSelected={selectedTodos.includes(todo.id)}
                  cachedThemes={cachedThemes}
                  onSaveTheme={saveTheme}
                  doubleClickToEdit
                />
              ))}
              <TodoItem
                key={`temp-${tempTodoKey}`}
                todo={tempTodo}
                onUpdate={handleTempTodoChange}
                onSave={handleTempTodoSave}
                onCancel={handleTempTodoCancel}
                onDelete={() => {}}
                onDuplicate={() => {}}
                onToggleSelect={() => {}}
                isSelected={false}
                cachedThemes={cachedThemes}
                onSaveTheme={saveTheme}
                startEditing
              />
            </Box>
          </SortableContext>
        </DndContext>
      </Container>

      <Fab
        color="primary"
        aria-label="add"
        onClick={addTodo}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      <Fab
        color="secondary"
        aria-label="settings"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 80,
        }}
      >
        <Settings />
      </Fab>

      <ThemeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cachedThemes={cachedThemes}
        onUpdateThemes={updateCachedThemes}
      />

      <ImportExportDialog
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
      />
    </Box>
  )
}

