import { RouterProvider } from "react-router-dom";
import { router } from "./router/AppRouter.tsx";
import { ConfigProvider, theme } from "antd";
import { GetTheme } from "./hooks/useTheme.ts";
import Loading from "./components/loading/Loading.tsx";
import { useConfig } from "./config/useConfig.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";

const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const AppContent = () => {
  const { mode, palette } = GetTheme();
  const { loading, hasError } = useConfig();

  if (loading || hasError) {
    return <Loading />;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm,
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
