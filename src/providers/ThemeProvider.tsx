import { useState } from "react";
import { ThemeContext } from "../hooks/useTheme.ts";
import type { ThemeMode } from "@/components/theme/theme.ts";
import { getLocal, setLocal } from "@/hooks/storage.ts";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (getLocal("theme") as ThemeMode) || "dark";
  });

  const handleSetMode = (mode: ThemeMode) => {
    setMode(mode);
    setLocal("theme", mode);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode: handleSetMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
