import { createContext, useContext } from "react";
import {
  darkColors,
  lightColors,
  type ThemeMode,
} from "@/styles/theme";

export interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const GetTheme = () => {
  const { mode, setMode } = useTheme();
  const palette = mode === "light" ? lightColors : darkColors;

  return {
    mode,
    setMode,
    palette,
  };
};
