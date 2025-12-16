import React from "react";
import ErrorPage from "@/pages/ErrorPage";
// import ServiceUnvailablePage from "@/pages/ServiceUnavailablePage";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("UI crash:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return ErrorPage();
    }

    return this.props.children;
  }
}
