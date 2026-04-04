import useTheme from "@/hooks/useTheme";
import {
  useNotificationsQuery,
  type NotificationItem,
} from "@/api/notifications";
import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMeStore } from "@/store/useMeStore";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Layout,
  List,
  Popover,
  Space,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

interface MainHeaderProps {
  collapsed: boolean;
  setCollapsed: () => void;
}

const MainHeader = ({ collapsed, setCollapsed }: MainHeaderProps) => {
  const { theme, setTheme, palette } = useTheme();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const me = useMeStore((s) => s.me);
  const logout = useMeStore((s) => s.logout);
  const navigate = useNavigate();
  const { data: notificationData = [] } = useNotificationsQuery();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setNotifications(notificationData);
  }, [notificationData]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const initials = useMemo(() => {
    const name = me?.info?.fullName?.trim();
    if (!name) return "U";
    const parts = name.split(/\s+/).filter(Boolean);
    return parts.length === 1
      ? parts[0].charAt(0).toUpperCase()
      : `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }, [me]);

  const notificationContent = (
    <div style={{ width: isMobile ? 300 : 380 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text strong style={{ color: palette.text, fontSize: 15 }}>
          Notifications
        </Text>
        <Button type="link" size="small" onClick={markAllAsRead}>
          Mark all read
        </Button>
      </div>
      <List
        dataSource={notifications}
        locale={{ emptyText: "No notifications." }}
        renderItem={(item) => (
          <List.Item
            style={{
              paddingInline: 8,
              borderRadius: 8,
              background: item.read ? "transparent" : `${palette.primary}12`,
              border: `1px solid ${item.read ? palette.border : `${palette.primary}40`}`,
              marginBottom: 8,
              cursor: "pointer",
            }}
            onClick={() => markAsRead(item.id)}
          >
            <Flex vertical gap={2} style={{ width: "100%" }}>
              <Space style={{ justifyContent: "space-between", width: "100%" }}>
                <Text strong style={{ color: palette.text }}>
                  {item.title}
                </Text>
                {!item.read && <Badge status="processing" />}
              </Space>
              <Text style={{ color: palette.textSecondary, fontSize: 12 }}>
                {item.description}
              </Text>
            </Flex>
          </List.Item>
        )}
      />
    </div>
  );

  const profileContent = (
    <div style={{ width: isMobile ? 260 : 300 }}>
      <Flex vertical gap="middle" style={{ width: "100%" }}>
        <Space>
          <Avatar
            size={48}
            src={me?.info?.avatarUrl}
            style={{
              background: `${palette.primary}25`,
              color: palette.primary,
              fontWeight: 700,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          >
            {initials}
          </Avatar>
          <Flex vertical gap={0}>
            <Text strong style={{ color: palette.text }}>
              {me?.info?.fullName || "User"}
            </Text>
            <Text style={{ color: palette.textSecondary, fontSize: 12 }}>
              {me?.info?.email || "email@example.com"}
            </Text>
            <Tag color="blue" style={{ width: "fit-content", marginTop: 4 }}>
              {me?.isSuperAdmin ? "Super Admin" : "Member"}
            </Tag>
          </Flex>
        </Space>

        <Divider style={{ margin: 0 }} />

        <Button
          block
          icon={<UserOutlined />}
          style={{ justifyContent: "flex-start" }}
          onClick={() => navigate("/settings")}
        >
          My Profile
        </Button>
        <Button
          block
          icon={<SettingOutlined />}
          style={{ justifyContent: "flex-start" }}
          onClick={() => navigate("/settings")}
        >
          Account Settings
        </Button>
        <Button
          block
          danger
          icon={<LogoutOutlined />}
          style={{ justifyContent: "flex-start" }}
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          Logout
        </Button>
      </Flex>
    </div>
  );

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
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {collapsed ? (
          <MenuUnfoldOutlined
            style={{ fontSize: 20, cursor: "pointer", color: palette.text }}
            onClick={setCollapsed}
          />
        ) : (
          <MenuFoldOutlined
            style={{ fontSize: 20, cursor: "pointer", color: palette.text }}
            onClick={setCollapsed}
          />
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 18 }}>
        <Switch
          checkedChildren={<SunOutlined />}
          unCheckedChildren={<MoonOutlined />}
          checked={theme === "light"}
          onChange={(checked) => setTheme(checked ? "light" : "dark")}
        />

        <Popover content={notificationContent} trigger="click" placement="bottomRight">
          <Badge count={unreadCount} size="small">
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined style={{ fontSize: 18 }} />}
              style={{
                width: 40,
                height: 40,
                color: palette.text,
                border: `1px solid ${palette.border}`,
                background: `${palette.primary}14`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Badge>
        </Popover>

        <Popover content={profileContent} trigger="click" placement="bottomRight">
          <div
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              size={34}
              src={me?.info?.avatarUrl}
              icon={!me?.info?.fullName ? <UserOutlined /> : undefined}
              style={{
                background: palette.primary,
                color: "#fff",
                fontWeight: 700,
                borderRadius: "50%",
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "34px",
                objectFit: "cover",
              }}
            >
              {me?.info?.fullName ? initials : null}
            </Avatar>
          </div>
        </Popover>
      </div>
    </Header>
  );
};

export default MainHeader;
