import { Grid, Layout } from "antd";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { useEffect, useState } from "react";

const HomeLayout = () => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const [collapsed, setCollapsed] = useState<boolean>(true);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const collapsedWidth = isMobile ? 0 : 80;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={() => setCollapsed(!collapsed)}
        collapsedWidth={collapsedWidth}
      />

      {/* Main layout */}
      <MainContent
        collapsed={collapsed}
        setCollapsed={() => setCollapsed(!collapsed)}
      />
    </Layout>
  );
};

export default HomeLayout;
