import { useState } from "react";
import { ThemeContext, type ThemeContextType } from "../hooks/useTheme.ts";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] =
    useState<ThemeContextType["themeMode"]>("light");

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
