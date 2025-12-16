import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "@/styles/index.css";
import App from "./App.tsx";
import AppProvider from "./providers/AppProvider.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import QueryProvider from "./providers/QueryClientProvider.tsx";
import { ErrorBoundary } from "./providers/ErrorCatchProvider.tsx";
import AuthProvider from "./providers/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <AppProvider>
          <ThemeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </AppProvider>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>
);
