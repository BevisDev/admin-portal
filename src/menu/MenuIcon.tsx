import {
  DashboardOutlined,
  KeyOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const MenuIcon: Record<string, React.ReactNode> = {
  dashboard: <DashboardOutlined />,
  settings: <SettingOutlined />,
  accessControl: <SafetyOutlined />,
  users: <UserOutlined />,
  roles: <TeamOutlined />,
  permissions: <KeyOutlined />,
};
