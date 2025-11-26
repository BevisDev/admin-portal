import { Layout } from "antd";
import MainHeader from "./MainHeader";
import { Outlet } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { darkColors, lightColors } from "@/types/theme";

const { Content } = Layout;

interface MainContentProps {
  collapsed: boolean;
  setCollapsed: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const { themeMode } = useTheme();
  const palette = themeMode === "light" ? lightColors : darkColors;

  return (
    <Layout>
      {/* Header */}
      <MainHeader collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content */}
      <Content
        style={{
          padding: 24,
          background: palette.background,
          overflow: "auto",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainContent;
