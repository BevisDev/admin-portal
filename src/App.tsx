import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ConfigProvider, theme } from "antd";
import * as ThemeProvider from "./providers/ThemeProvider";
import { useTheme } from "./hooks/useTheme.ts";
import { darkColors, lightColors } from "./types/theme.ts";

const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  return (
    <ThemeProvider.ThemeProvider>
      <AppContent />
    </ThemeProvider.ThemeProvider>
  );
}

export function AppContent() {
  const { themeMode } = useTheme();
  const palette = themeMode === "light" ? lightColors : darkColors;

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === "light" ? defaultAlgorithm : darkAlgorithm,
        token: {
          colorPrimary: palette.primary,
          colorBgLayout: palette.background,
          colorBorder: palette.border,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
