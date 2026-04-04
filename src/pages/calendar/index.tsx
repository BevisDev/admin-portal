import {
  Badge,
  Button,
  Calendar,
  Card,
  Col,
  Flex,
  Input,
  List,
  Row,
  Segmented,
  Space,
  Statistic,
  Tag,
  Typography,
  Grid,
  message,
} from "antd";
import { CalendarOutlined, LinkOutlined, SyncOutlined } from "@ant-design/icons";
import useTheme from "@/hooks/useTheme";
import { SysConfig } from "@/config/SysConfig";
import { useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import type { BadgeProps } from "antd";
import type { CalendarProps } from "antd";

const { Title, Text } = Typography;

const DEFAULT_EMBED_URL = "https://calendar.google.com/calendar/embed?src=vi.vietnamese%23holiday%40group.v.calendar.google.com&ctz=Asia%2FHo_Chi_Minh";
const STORAGE_KEY = "admin-portal:google-calendar-embed-url";
const VIEW_STORAGE_KEY = "admin-portal:calendar-view-mode";

type EventType = "meeting" | "focus" | "deadline";
type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  type: EventType;
};

const DEMO_EVENTS: Record<string, CalendarEvent[]> = {
  [dayjs().format("YYYY-MM-DD")]: [
    { id: "today-1", title: "Daily standup", time: "09:00", type: "meeting" },
    { id: "today-2", title: "Review sprint board", time: "14:00", type: "focus" },
  ],
  [dayjs().add(1, "day").format("YYYY-MM-DD")]: [
    { id: "tomorrow-1", title: "Client sync", time: "10:00", type: "meeting" },
    { id: "tomorrow-2", title: "Deadline report", time: "16:30", type: "deadline" },
  ],
  [dayjs().add(3, "day").format("YYYY-MM-DD")]: [
    { id: "soon-1", title: "Planning Q2", time: "11:00", type: "meeting" },
  ],
};

const CalendarPage = () => {
  const { palette } = useTheme();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [embedUrl, setEmbedUrl] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_EMBED_URL;
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_EMBED_URL;
  });
  const [viewMode, setViewMode] = useState<"custom" | "embed">(() => {
    if (typeof window === "undefined") return "custom";
    const mode = window.localStorage.getItem(VIEW_STORAGE_KEY);
    return mode === "embed" ? "embed" : "custom";
  });
  const [inputUrl, setInputUrl] = useState<string>(embedUrl);

  const googleSyncUrl = useMemo(() => {
    if (!SysConfig.googleOauthUrl || !SysConfig.googleClientId || !SysConfig.googleRedirectUri) {
      return "";
    }

    const state =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    const params = new URLSearchParams({
      client_id: SysConfig.googleClientId,
      redirect_uri: SysConfig.googleRedirectUri,
      response_type: "code",
      scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
      access_type: "offline",
      prompt: "consent",
      state,
    });

    return `${SysConfig.googleOauthUrl}?${params.toString()}`;
  }, []);

  const selectedEvents = useMemo(() => {
    return DEMO_EVENTS[selectedDate.format("YYYY-MM-DD")] || [];
  }, [selectedDate]);

  const getEventColor = (type: EventType): BadgeProps["status"] => {
    if (type === "meeting") return "processing";
    if (type === "focus") return "success";
    return "error";
  };

  const renderCalendarCell: CalendarProps<Dayjs>["cellRender"] = (value, info) => {
    if (info.type !== "date") return info.originNode;
    const list = DEMO_EVENTS[value.format("YYYY-MM-DD")] || [];
    if (list.length === 0) return null;

    return (
      <Space size={4} wrap>
        {list.slice(0, 2).map((event) => (
          <Badge
            key={event.id}
            status={getEventColor(event.type)}
            text={
              <span style={{ fontSize: 11, color: palette.textSecondary }}>
                {event.time}
              </span>
            }
          />
        ))}
      </Space>
    );
  };

  const applyEmbedUrl = () => {
    if (!inputUrl.startsWith("https://calendar.google.com/calendar/embed")) {
      message.error("Please enter a valid Google Calendar embed link.");
      return;
    }

    setEmbedUrl(inputUrl);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, inputUrl);
    }
    message.success("Google Calendar has been updated.");
  };

  return (
    <Flex vertical gap="large" style={{ width: "100%" }}>
      <Card
        bordered={false}
        style={{
          background: palette.cardBg,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
        }}
      >
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} lg={12}>
            <Flex vertical gap={6}>
              <Space>
                <CalendarOutlined style={{ color: palette.primary, fontSize: 20 }} />
                <Title level={isMobile ? 4 : 3} style={{ margin: 0, color: palette.text }}>
                  Work Calendar
                </Title>
              </Space>
              <Text style={{ color: palette.textSecondary }}>
                Full-size calendar with custom UI; switch to Google Embed when needed.
              </Text>
            </Flex>
          </Col>
          <Col xs={24} lg={12}>
            <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
              <Segmented
                value={viewMode}
                options={[
                  { label: "Custom UI", value: "custom" },
                  { label: "Google Embed", value: "embed" },
                ]}
                onChange={(value) => {
                  const mode = value as "custom" | "embed";
                  setViewMode(mode);
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
                  }
                }}
              />
              {viewMode === "embed" && (
                <Input
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Paste Google Calendar embed link..."
                  style={{ width: isMobile ? "100%" : 360 }}
                  prefix={<LinkOutlined />}
                />
              )}
              {viewMode === "embed" && (
                <Button type="primary" onClick={applyEmbedUrl}>
                  Update calendar
                </Button>
              )}
              <Input
                readOnly
                value={
                  googleSyncUrl
                    ? "Ready to connect to Google Calendar API"
                    : "Missing Google OAuth environment variables"
                }
                style={{ width: isMobile ? "100%" : 300 }}
                prefix={<SyncOutlined />}
              />
              <Button type="default"
                disabled={!googleSyncUrl}
                onClick={() => window.open(googleSyncUrl, "_blank", "noopener,noreferrer")}
              >
                Connect Google
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card
        bordered={false}
        style={{
          background: palette.cardBg,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
        }}
        styles={{ body: { padding: 12 } }}
      >
        {viewMode === "embed" ? (
          <iframe
            title="Google Calendar"
            src={embedUrl}
            style={{
              border: 0,
              width: "100%",
              height: "calc(100vh - 220px)",
              minHeight: isMobile ? 520 : 700,
              borderRadius: 8,
              background: palette.background,
            }}
          />
        ) : (
          <Row gutter={[16, 16]}>
            <Col xs={24} xl={17}>
              <div
                style={{
                  border: `1px solid ${palette.border}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  minHeight: isMobile ? 520 : "calc(100vh - 250px)",
                }}
              >
                <Calendar
                  fullscreen
                  value={selectedDate}
                  onSelect={(value: Dayjs) => setSelectedDate(value)}
                  cellRender={renderCalendarCell}
                />
              </div>
            </Col>
            <Col xs={24} xl={7}>
              <Flex vertical gap="middle" style={{ width: "100%" }}>
                <Card
                  bordered={false}
                  style={{
                    background: palette.background,
                    border: `1px solid ${palette.border}`,
                  }}
                >
                  <Statistic
                    title={<span style={{ color: palette.textSecondary }}>Selected date</span>}
                    value={selectedDate.format("DD/MM/YYYY")}
                    valueStyle={{ color: palette.text, fontSize: 22 }}
                  />
                </Card>
                <Card
                  title={
                    <span style={{ color: palette.text, fontWeight: 600 }}>
                      Daily agenda
                    </span>
                  }
                  bordered={false}
                  style={{
                    background: palette.background,
                    border: `1px solid ${palette.border}`,
                  }}
                  styles={{ body: { paddingTop: 8 } }}
                >
                  <List
                    locale={{ emptyText: "No events yet." }}
                    dataSource={selectedEvents}
                    renderItem={(item) => (
                      <List.Item key={item.id}>
                        <Flex vertical gap={4}>
                          <Text strong style={{ color: palette.text }}>
                            {item.title}
                          </Text>
                          <Space size={8}>
                            <Tag color={getEventColor(item.type)}>{item.type}</Tag>
                            <Text style={{ color: palette.textSecondary }}>{item.time}</Text>
                          </Space>
                        </Flex>
                      </List.Item>
                    )}
                  />
                </Card>
              </Flex>
            </Col>
          </Row>
        )}
      </Card>
    </Flex>
  );
};

export default CalendarPage;
