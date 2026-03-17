import {
  Card,
  Col,
  Progress,
  Row,
  Space,
  Statistic,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import useTheme from "@/hooks/useTheme";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const statCards = [
  {
    key: "tasks",
    title: "Tổng công việc",
    value: 128,
    suffix: "task",
    icon: <FileTextOutlined />,
    trend: "+12%",
    color: "#9c6bff",
    link: "/todo",
  },
  {
    key: "completed",
    title: "Đã hoàn thành",
    value: 94,
    suffix: "task",
    icon: <CheckCircleOutlined />,
    trend: "+8%",
    color: "#52c41a",
  },
  {
    key: "inProgress",
    title: "Đang thực hiện",
    value: 24,
    suffix: "task",
    icon: <ClockCircleOutlined />,
    trend: "−3%",
    color: "#1890ff",
  },
  {
    key: "users",
    title: "Thành viên",
    value: 16,
    suffix: "người",
    icon: <TeamOutlined />,
    trend: "+2",
    color: "#eb2f96",
    link: "/users",
  },
];

const DashBoardPage = () => {
  const { palette } = useTheme();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Welcome */}
      <div>
        <Title
          level={3}
          style={{
            margin: 0,
            fontWeight: 700,
            color: palette.text,
            letterSpacing: "-0.02em",
          }}
        >
          {greeting()} 👋
        </Title>
        <Text style={{ color: palette.textSecondary, fontSize: 15 }}>
          Đây là tổng quan hoạt động của bạn hôm nay.
        </Text>
      </div>

      {/* Stat cards */}
      <Row gutter={[20, 20]}>
        {statCards.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.key}>
            <Link
              to={item.link ?? "#"}
              style={{
                textDecoration: "none",
                display: "block",
                pointerEvents: item.link ? "auto" : "none",
              }}
            >
              <Card
                bordered={false}
                style={{
                  background: palette.cardBg,
                  border: `1px solid ${palette.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                styles={{
                  body: { padding: "20px 24px" },
                }}
                hoverable={!!item.link}
                onMouseEnter={(e) => {
                  if (item.link) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${palette.primary}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${item.color}18`,
                        color: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                      }}
                    >
                      {item.icon}
                    </span>
                    {item.trend && (
                      <Text
                        strong
                        style={{
                          fontSize: 13,
                          color: item.trend.startsWith("−")
                            ? palette.textSecondary
                            : "#52c41a",
                        }}
                      >
                        {item.trend}
                        {item.trend.includes("%") && item.trend.startsWith("+") && (
                          <ArrowUpOutlined style={{ marginLeft: 2, fontSize: 10 }} />
                        )}
                      </Text>
                    )}
                  </div>
                  <Statistic
                    title={
                      <span style={{ color: palette.textSecondary, fontSize: 13 }}>
                        {item.title}
                      </span>
                    }
                    value={item.value}
                    suffix={
                      <span style={{ fontSize: 14, color: palette.textSecondary }}>
                        {item.suffix}
                      </span>
                    }
                    valueStyle={{
                      fontWeight: 700,
                      fontSize: 28,
                      color: palette.text,
                      letterSpacing: "-0.02em",
                    }}
                  />
                </Space>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Progress overview + Quick tip */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            title={
              <Space>
                <RiseOutlined style={{ color: palette.primary }} />
                <span style={{ color: palette.text, fontWeight: 600 }}>
                  Tiến độ công việc
                </span>
              </Space>
            }
            style={{
              background: palette.cardBg,
              border: `1px solid ${palette.border}`,
              borderRadius: 12,
            }}
            styles={{ body: { padding: "24px" } }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: palette.textSecondary }}>To-do</Text>
                  <Text strong style={{ color: palette.text }}>
                    73%
                  </Text>
                </div>
                <Progress
                  percent={73}
                  strokeColor={palette.primary}
                  trailColor={palette.border}
                  strokeWidth={10}
                  showInfo={false}
                  style={{ marginBottom: 0 }}
                />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: palette.textSecondary }}>In progress</Text>
                  <Text strong style={{ color: palette.text }}>
                    19%
                  </Text>
                </div>
                <Progress
                  percent={19}
                  strokeColor="#1890ff"
                  trailColor={palette.border}
                  strokeWidth={10}
                  showInfo={false}
                  style={{ marginBottom: 0 }}
                />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: palette.textSecondary }}>Done</Text>
                  <Text strong style={{ color: palette.text }}>
                    8%
                  </Text>
                </div>
                <Progress
                  percent={8}
                  strokeColor="#52c41a"
                  trailColor={palette.border}
                  strokeWidth={10}
                  showInfo={false}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{
              background: `linear-gradient(135deg, ${palette.primary}22 0%, ${palette.primary}08 100%)`,
              border: `1px solid ${palette.primary}40`,
              borderRadius: 12,
              height: "100%",
            }}
            styles={{ body: { padding: "24px" } }}
          >
            <Space direction="vertical" size="middle">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${palette.primary}30`,
                  color: palette.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                <CheckCircleOutlined />
              </div>
              <Title level={5} style={{ margin: 0, color: palette.text }}>
                Mẹo nhanh
              </Title>
              <Text style={{ color: palette.textSecondary, display: "block" }}>
                Tạo công việc mới từ trang To-do hoặc kéo thả giữa các cột trên
                bảng Kanban để cập nhật trạng thái nhanh hơn.
              </Text>
              <Link
                to="/todo"
                style={{
                  color: palette.primary,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Mở To-do →
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default DashBoardPage;
