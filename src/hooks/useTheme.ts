import { createContext, useContext } from "react";
import type { ThemeMode } from "../types/theme";

export interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const defThemeCtx: ThemeContextType = {
  themeMode: "light",
  setThemeMode: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defThemeCtx);

export const useTheme = () => useContext(ThemeContext);
