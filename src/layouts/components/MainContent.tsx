import { Layout } from "antd";
import MainHeader from "./MainHeader";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

interface MainContentProps {
  collapsed: boolean;
  setCollapsed: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  collapsed,
  setCollapsed,
}) => {
  return (
    <Layout>
      {/* Header */}
      <MainHeader collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content */}
      <Content
        style={{
          padding: 24,
          background: "#fff",
          overflow: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainContent;
