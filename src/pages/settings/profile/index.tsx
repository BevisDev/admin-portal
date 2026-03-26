import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const SettingsProfilePage = () => {
  return (
    <Card>
      <Title level={4} style={{ marginTop: 0 }}>
        Profile Settings
      </Title>
      <Text type="secondary">
        Configure your personal information, display name, and contact details.
      </Text>
    </Card>
  );
};

export default SettingsProfilePage;
