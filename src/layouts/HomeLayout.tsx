import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { useState } from "react";

const HomeLayout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={() => setCollapsed(!collapsed)}
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
