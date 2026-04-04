import {
  Alert,
  Card,
  Col,
  Flex,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import useTheme from "@/hooks/useTheme";
import { Link } from "react-router-dom";
import { useTodoQuery } from "@/api/todo";
import dayjs from "dayjs";
import type { Task } from "@/types/todo/Board";

const { Title, Text } = Typography;

const DashBoardPage = () => {
  const { palette } = useTheme();
  const { data: todoData } = useTodoQuery();
  const tasks = todoData?.tasks ?? [];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getCompletion = (task: Task) => task.progress ?? 0;
  const now = dayjs().startOf("day");
  const completedTasks = tasks.filter((t) => getCompletion(t) >= 100);
  const inProgressTasks = tasks.filter((t) => getCompletion(t) > 0 && getCompletion(t) < 100);
  const todoTasks = tasks.filter((t) => getCompletion(t) === 0);
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && dayjs(t.dueDate).isBefore(now, "day") && getCompletion(t) < 100
  );
  const highPriorityTasks = tasks.filter((t) => t.priority >= 3 && getCompletion(t) < 100);

  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const statCards = [
    {
      key: "tasks",
      title: "Total tasks",
      value: tasks.length,
      suffix: "tasks",
      icon: <FileTextOutlined />,
      trend: `${todoTasks.length} pending`,
      color: "#9c6bff",
      link: "/todo",
    },
    {
      key: "completed",
      title: "Completed",
      value: completedTasks.length,
      suffix: "tasks",
      icon: <CheckCircleOutlined />,
      trend: `${completionRate}% done`,
      color: "#52c41a",
    },
    {
      key: "inProgress",
      title: "In progress",
      value: inProgressTasks.length,
      suffix: "tasks",
      icon: <ClockCircleOutlined />,
      trend: `${highPriorityTasks.length} high priority`,
      color: "#1890ff",
    },
    {
      key: "overdue",
      title: "Overdue",
      value: overdueTasks.length,
      suffix: "tasks",
      icon: <ExclamationCircleOutlined />,
      trend: overdueTasks.length > 0 ? "Needs attention" : "All good",
      color: "#eb2f96",
    },
  ];

  const highlightTasks = [...tasks]
    .filter((t) => t.dueDate && getCompletion(t) < 100)
    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())
    .slice(0, 5);

  return (
    <Flex vertical gap="large" style={{ width: "100%" }}>
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
          Here is your activity overview for today.
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
                <Flex vertical gap="middle" style={{ width: "100%" }}>
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
                          color: item.key === "overdue" && overdueTasks.length > 0
                            ? "#ff4d4f"
                            : "#52c41a",
                        }}
                      >
                        {item.trend}
                        {item.trend.includes("%") && (
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
                </Flex>
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
                  Work progress
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
            <Flex vertical gap="large" style={{ width: "100%" }}>
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
                  percent={Math.round((todoTasks.length / Math.max(tasks.length, 1)) * 100)}
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
                    {Math.round((inProgressTasks.length / Math.max(tasks.length, 1)) * 100)}%
                  </Text>
                </div>
                <Progress
                  percent={Math.round((inProgressTasks.length / Math.max(tasks.length, 1)) * 100)}
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
                    {completionRate}%
                  </Text>
                </div>
                <Progress
                  percent={completionRate}
                  strokeColor="#52c41a"
                  trailColor={palette.border}
                  strokeWidth={10}
                  showInfo={false}
                />
              </div>
            </Flex>
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
            <Flex vertical gap="middle">
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
                Highlights
              </Title>
              {overdueTasks.length > 0 && (
                <Alert
                  type="warning"
                  showIcon
                  message={`${overdueTasks.length} overdue task(s) need immediate action`}
                />
              )}
              <List
                size="small"
                dataSource={highlightTasks}
                locale={{ emptyText: "No urgent tasks right now." }}
                renderItem={(task) => (
                  <List.Item style={{ paddingInline: 0 }}>
                    <Flex vertical gap={4} style={{ width: "100%" }}>
                      <Text strong style={{ color: palette.text }}>
                        {task.title}
                      </Text>
                      <Flex justify="space-between" align="center">
                        <Text style={{ color: palette.textSecondary, fontSize: 12 }}>
                          Due {dayjs(task.dueDate).format("DD MMM YYYY")}
                        </Text>
                        <Tag color={task.priority >= 3 ? "red" : "blue"}>
                          P{task.priority}
                        </Tag>
                      </Flex>
                    </Flex>
                  </List.Item>
                )}
              />
              <Link
                to="/todo"
                style={{
                  color: palette.primary,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Open To-do Board →
              </Link>
            </Flex>
          </Card>
        </Col>
      </Row>
    </Flex>
  );
};

export default DashBoardPage;
