import { Layout } from "antd";
import MainHeader from "./MainHeader";
import { Outlet } from "react-router-dom";
import { GetTheme } from "@/hooks/useTheme";

const { Content } = Layout;

interface MainContentProps {
  collapsed: boolean;
  setCollapsed: () => void;
}

const MainContent = ({ collapsed, setCollapsed }: MainContentProps) => {
  const { palette } = GetTheme();

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
