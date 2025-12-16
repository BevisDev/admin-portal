import useTheme from "@/hooks/useTheme";
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Layout, Switch, type MenuProps } from "antd";

const { Header } = Layout;

interface MainHeaderProps {
  collapsed: boolean;
  setCollapsed: () => void;
}

const MainHeader = ({ collapsed, setCollapsed }: MainHeaderProps) => {
  const { theme, setTheme, palette } = useTheme();
  const notiMenuItems: MenuProps["items"] = [
    { key: "1", label: "New notification 1" },
    { key: "2", label: "New notification 2" },
    { key: "3", label: "System alert" },
  ];

  const profileMenuItems: MenuProps["items"] = [
    { key: "1", label: "My Profile" },
    { key: "2", label: "Settings" },
    { type: "divider" },
    { key: "3", label: "Logout" },
  ];

  return (
    <Header
      style={{
        height: 64,
        padding: "0 20px",
        background: palette.sidebarBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${palette.sidebarBorder}`,
      }}
    >
      {/* Sidebar toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {collapsed ? (
          <MenuUnfoldOutlined
            style={{ fontSize: 20, cursor: "pointer" }}
            onClick={setCollapsed}
          />
        ) : (
          <MenuFoldOutlined
            style={{ fontSize: 20, cursor: "pointer" }}
            onClick={setCollapsed}
          />
        )}
      </div>

      {/* RIGHT: theme | noti | avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* Theme Switch */}
        <Switch
          checkedChildren={<SunOutlined />}
          unCheckedChildren={<MoonOutlined />}
          checked={theme === "light"}
          onChange={(checked) => setTheme(checked ? "light" : "dark")}
        />

        {/* Notifications */}
        <Dropdown
          menu={{
            items: notiMenuItems,
          }}
          trigger={["click"]}
        >
          <Badge count={3}>
            <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
          </Badge>
        </Dropdown>

        {/* Profile */}
        <Dropdown
          menu={{
            items: profileMenuItems,
          }}
          trigger={["click"]}
        >
          <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default MainHeader;
