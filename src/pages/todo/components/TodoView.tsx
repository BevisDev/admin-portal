import type { Task } from "@/types/todo/Board";
import {
  Card,
  Checkbox,
  Flex,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  CommentOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import TagPriority from "./TagPriority";
import TaskProgress from "./TaskProgress";
import { formatDate } from "@/utils/date";
import useTheme from "@/hooks/useTheme";
import { useState, useMemo } from "react";
import ModalTask from "./ModalTask";
import dayjs, { type Dayjs } from "dayjs";
import { useTodoQuery, useUpdateTaskMutation } from "@/api/todo";

const { Text } = Typography;

interface TodoViewProps {
  tasks: Task[];
  filterDateRange?: [Dayjs | null, Dayjs | null] | null;
}

// Helper to get status color based on columnId
const getStatusColor = (columnId: number): string => {
  switch (columnId) {
    case 1:
      return "default"; // Planned
    case 2:
      return "processing"; // In Progress
    case 3:
      return "success"; // Done
    default:
      return "default";
  }
};

const getStatusText = (columnId: number): string => {
  switch (columnId) {
    case 1:
      return "Planned";
    case 2:
      return "In Progress";
    case 3:
      return "Done";
    default:
      return "Unknown";
  }
};

// Column id for Done (default 3) and Planned (default 1)
const COL_DONE = 3;
const COL_PLANNED = 1;

const TodoView = ({ tasks, filterDateRange }: TodoViewProps) => {
  const { palette } = useTheme();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const updateTaskMutation = useUpdateTaskMutation();
  const { data: todoData } = useTodoQuery();
  const columns = todoData?.columns ?? [];
  const doneColId = columns.find((c) => c.title === "Done")?.id ?? COL_DONE;
  const plannedColId = columns.find((c) => c.title === "Planned")?.id ?? COL_PLANNED;

  // Filter tasks: if filterDateRange is set, use it; otherwise show today's tasks
  const filteredTasks = useMemo(() => {
    if (
      filterDateRange &&
      filterDateRange[0] !== null &&
      filterDateRange[1] !== null
    ) {
      // If user has selected a date range, show tasks in that range
      const startDate = filterDateRange[0].startOf("day");
      const endDate = filterDateRange[1].endOf("day");
      return tasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = dayjs(task.dueDate).startOf("day");
        return (
          (taskDate.isSame(startDate) || taskDate.isAfter(startDate)) &&
          (taskDate.isSame(endDate) || taskDate.isBefore(endDate))
        );
      });
    }

    // Default: only show tasks with dueDate = today
    const today = dayjs().startOf("day");
    return tasks.filter((task) => {
      if (!task.dueDate) {
        return false;
      }
      const taskDate = dayjs(task.dueDate).startOf("day");
      return taskDate.isSame(today);
    });
  }, [tasks, filterDateRange]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCheckboxChange = async (task: Task, checked: boolean) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        taskData: {
          progress: checked ? 100 : 0,
          columnId: checked ? doneColId : plannedColId,
          status: checked
            ? (columns.find((c) => c.id === doneColId)?.title ?? "Done")
            : (columns.find((c) => c.id === plannedColId)?.title ?? "Planned"),
        },
      });
    } catch {
      // Error already handled by mutation / can show toast
    }
  };

  if (filteredTasks.length === 0) {
    let displayText = "";
    if (
      filterDateRange &&
      filterDateRange[0] !== null &&
      filterDateRange[1] !== null
    ) {
      displayText = `from ${filterDateRange[0].format("DD/MM/YYYY")} to ${filterDateRange[1].format("DD/MM/YYYY")}`;
    } else {
      displayText = `today (${dayjs().format("DD/MM/YYYY")})`;
    }
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: palette.textSecondary,
        }}
      >
        <Typography.Text style={{ fontSize: 16 }}>
          No tasks with due date {displayText}
        </Typography.Text>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: 16,
        }}
      >
        {filteredTasks.map((task) => {
          const isDone = task.progress === 100;
          const progress = task.progress ?? 0;

          return (
            <Card
              key={task.id}
              hoverable
              onClick={() => handleTaskClick(task)}
              style={{
                borderRadius: 12,
                border: `1px solid ${palette.border}`,
                background: palette.cardBg,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              styles={{
                body: {
                  padding: 16,
                },
              }}
            >
              {/* Header: Checkbox + Title */}
              <Flex align="start" gap={12} style={{ marginBottom: 12 }}>
                <Checkbox
                  checked={isDone}
                  disabled={updateTaskMutation.isPending}
                  style={{ marginTop: 2 }}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleCheckboxChange(task, e.target.checked)}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    strong
                    style={{
                      fontSize: 15,
                      color: palette.text,
                      textDecoration: isDone ? "line-through" : "none",
                      opacity: isDone ? 0.6 : 1,
                      display: "block",
                      wordBreak: "break-word",
                    }}
                  >
                    {task.title}
                  </Text>
                </div>
              </Flex>

              {/* Description */}
              {task.description && (
                <Text
                  style={{
                    color: palette.textSecondary,
                    fontSize: 13,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    marginBottom: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {task.description}
                </Text>
              )}

              {/* Tags: Status + Priority */}
              <Flex gap={8} wrap="wrap" style={{ marginBottom: 12 }}>
                <Tag
                  color={getStatusColor(task.columnId)}
                  style={{ borderRadius: 6, margin: 0 }}
                >
                  {getStatusText(task.columnId)}
                </Tag>
                {task.priority && <TagPriority id={task.priority} />}
              </Flex>

              {/* Progress */}
              {progress > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <TaskProgress percent={progress} />
                </div>
              )}

              {/* Footer: Due Date + Metadata */}
              <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
                <Space size="small">
                  {task.dueDate && (
                    <Space size={4} style={{ color: palette.textSecondary }}>
                      <CalendarOutlined style={{ fontSize: 12 }} />
                      <Text
                        style={{
                          fontSize: 12,
                          color: palette.textSecondary,
                        }}
                      >
                        {formatDate(task.dueDate, "DD MMM YYYY")}
                      </Text>
                    </Space>
                  )}
                </Space>

                <Space size="middle">
                  {task.comments !== undefined && task.comments > 0 && (
                    <Space size={4} style={{ color: palette.textSecondary }}>
                      <CommentOutlined style={{ fontSize: 12 }} />
                      <Text
                        style={{
                          fontSize: 12,
                          color: palette.textSecondary,
                        }}
                      >
                        {task.comments}
                      </Text>
                    </Space>
                  )}

                  {task.views !== undefined && task.views > 0 && (
                    <Space size={4} style={{ color: palette.textSecondary }}>
                      <EyeOutlined style={{ fontSize: 12 }} />
                      <Text
                        style={{
                          fontSize: 12,
                          color: palette.textSecondary,
                        }}
                      >
                        {task.views}
                      </Text>
                    </Space>
                  )}
                </Space>
              </Flex>

            </Card>
          );
        })}
      </div>

      {/* Modal Task Detail */}
      {selectedTask && (
        <ModalTask
          task={selectedTask}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      )}
    </>
  );
};

export default TodoView;
