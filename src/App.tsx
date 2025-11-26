import { RouterProvider } from "react-router-dom";
import { router } from "./router/AppRouter.tsx";
import { ConfigProvider, theme } from "antd";
import * as ThemeProvider from "./providers/ThemeProvider";
import { useTheme } from "./hooks/useTheme.ts";
import { darkColors, lightColors } from "./types/theme.ts";
import { useAppConfig } from "./config/useAppConfig.ts";
import { useAppStore } from "./store/AppStore.ts";
import { useEffect } from "react";
import Loading from "./components/loading/Loading.tsx";

const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  return (
    <ThemeProvider.ThemeProvider>
      <AppContent />
    </ThemeProvider.ThemeProvider>
  );
}

const AppContent = () => {
  const { themeMode } = useTheme();
  const palette = themeMode === "light" ? lightColors : darkColors;
  const { data, isLoading } = useAppConfig();
  const setAppConfig = useAppStore((s) => s.setAppConfig);

  useEffect(() => {
    if (data) {
      setAppConfig(data);
    }
  }, [data, isLoading, setAppConfig]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === "light" ? defaultAlgorithm : darkAlgorithm,
        token: {
          colorPrimary: palette.primary,
          colorBgBase: palette.background,
          colorBgLayout: palette.background,
          colorBgContainer: palette.cardBg,
          colorBgElevated: palette.headerBg,
          colorText: palette.text,
          colorTextSecondary: palette.textSecondary,
          colorBorder: palette.border,
          colorLink: palette.primary,
          controlItemBgActive: palette.menuActive,
          borderRadius: 10,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
