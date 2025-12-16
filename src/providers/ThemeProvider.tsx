import { useEffect, useMemo, useState } from "react";
import { getLocal, setLocal } from "@/hooks/storage.ts";
import { ConfigProvider, theme } from "antd";
import { useAppStore } from "@/store/useAppStore";
import { ThemeContext, type ThemeMode } from "@/store/useThemeCtx";
import { darkColorsDef, lightColorsDef } from "@/styles/theme";

const { defaultAlgorithm, darkAlgorithm } = theme;

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const appConfig = useAppStore((s) => s.appConfig);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return getLocal<ThemeMode>("theme") || "dark";
  });

  const handleSetTheme = (theme: ThemeMode) => {
    setLocal("theme", theme);
    setTheme(theme);
  };

  const palette = useMemo(() => {
    if (theme === "dark") {
      return appConfig?.darkColors ?? darkColorsDef;
    }
    return appConfig?.lightColors ?? lightColorsDef;
  }, [theme, appConfig]);

  const antdTheme = useMemo(() => {
    return {
      algorithm: theme === "light" ? defaultAlgorithm : darkAlgorithm,
      token: {
        colorPrimary: palette.primary,
        colorBgBase: palette.background,
        colorBgLayout: palette.background,
        colorBgContainer: palette.cardBg,
        colorText: palette.text,
        colorTextSecondary: palette.textSecondary,
        colorBorder: palette.border,
        colorLink: palette.primary,
        controlItemBgActive: palette.menuActive,
        borderRadius: 10,
      },
    };
  }, [theme, palette]);

  // APPLY BODY THEME
  useEffect(() => {
    document.body.style.backgroundColor = palette.background;
    document.body.style.color = palette.text;
  }, [palette]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};
