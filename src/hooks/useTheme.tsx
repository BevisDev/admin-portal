import { useThemeCtx } from "@/store/useThemeCtx";
import { useAppStore } from "@/store/useAppStore";
import { darkColorsDef, lightColorsDef } from "@/styles/theme";
import { useMemo } from "react";

const useTheme = () => {
  const { theme, setTheme } = useThemeCtx();
  const appConfig = useAppStore((s) => s.appConfig);

  const palette = useMemo(() => {
    if (theme == "dark") {
      return appConfig?.darkColors ?? darkColorsDef;
    }
    return appConfig?.lightColors ?? lightColorsDef;
  }, [theme, appConfig]);

  return {
    theme,
    setTheme,
    palette,
  };
};

export default useTheme;
