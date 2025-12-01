import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import Loading from "../components/loading/Loading";

const HomeLayout = () => {
  const { loading } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  if (loading) {
    return <Loading />;
  }

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
