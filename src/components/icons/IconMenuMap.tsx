import {
  CheckSquareOutlined,
  DashboardOutlined,
  KeyOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const IconMenuMap: Record<string, React.ReactNode> = {
  dashboard: <DashboardOutlined />,
  settings: <SettingOutlined />,
  accessControl: <SafetyOutlined />,
  users: <UserOutlined />,
  roles: <TeamOutlined />,
  permissions: <KeyOutlined />,
  todo: <CheckSquareOutlined />,
};
