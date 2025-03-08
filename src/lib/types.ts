import { M3SourceColors, HCTColor } from "./theme-utils";

export interface TodoTheme {
  name?: string;
  sources: M3SourceColors;
  primary: HCTColor;
  secondary: HCTColor;
  background: HCTColor;
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
