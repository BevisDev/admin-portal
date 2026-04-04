import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const SettingsAppearancePage = () => {
  return (
    <Card>
      <Title level={4} style={{ marginTop: 0 }}>
        Appearance Settings
      </Title>
      <Text type="secondary">
        Manage theme, color preferences, and layout display options.
      </Text>
    </Card>
  );
};

export default SettingsAppearancePage;
