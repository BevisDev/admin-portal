import { Grid, Layout } from "antd";
import MainHeader from "./MainHeader";
import { Outlet } from "react-router-dom";
import useTheme from "@/hooks/useTheme";
import { useMemo } from "react";

const { Content } = Layout;

interface MainContentProps {
  collapsed: boolean;
  setCollapsed: () => void;
}

const MainContent = ({ collapsed, setCollapsed }: MainContentProps) => {
  const { palette } = useTheme();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const padding = useMemo(() => (isMobile ? 12 : 24), [isMobile]);

  return (
    <Layout>
      {/* Header */}
      <MainHeader collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content */}
      <Content
        style={{
          padding,
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
