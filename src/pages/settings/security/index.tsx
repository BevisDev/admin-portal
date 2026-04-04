import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const SettingsSecurityPage = () => {
  return (
    <Card>
      <Title level={4} style={{ marginTop: 0 }}>
        Security Settings
      </Title>
      <Text type="secondary">
        Update password, session controls, and account security options.
      </Text>
    </Card>
  );
};

export default SettingsSecurityPage;
