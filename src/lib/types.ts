import type { M3SourceColors } from "./theme-utils";

export interface TodoTheme {
  name?: string;
  sources: M3SourceColors;
  primary: string;
  secondary: string;
  background: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  theme?: TodoTheme;
}
