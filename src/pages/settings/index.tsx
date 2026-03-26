import { Card, Space, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const SettingsPage = () => {
  return (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      <Title level={4} style={{ margin: 0 }}>
        Settings
      </Title>
      <Text type="secondary">
        Choose a settings category from the submenu, or quick access below.
      </Text>
      <Card>
        <Space direction="vertical" size={8}>
          <Link to="/settings/profile">Profile Settings</Link>
          <Link to="/settings/appearance">Appearance Settings</Link>
          <Link to="/settings/security">Security Settings</Link>
        </Space>
      </Card>
    </Space>
  );
};

export default SettingsPage;
