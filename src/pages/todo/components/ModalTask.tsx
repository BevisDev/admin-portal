import type { Task } from "@/types/todo/Board";
import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  Typography,
  message,
  Popconfirm,
} from "antd";
import {
  CalendarOutlined,
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { formatDate } from "@/utils/date";
import TagPriority from "./TagPriority";
import TaskProgress from "./TaskProgress";
import useTheme from "@/hooks/useTheme";
import { useTodoQuery, useUpdateTaskMutation, useDeleteTaskMutation } from "@/api/todo";
import { useState } from "react";
import dayjs from "dayjs";

const { Text } = Typography;
const { TextArea } = Input;

interface ModalTaskProps {
  task: Task;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleted?: () => void;
}

const getStatusColor = (columnId: number): string => {
  switch (columnId) {
    case 1:
      return "default";
    case 2:
      return "processing";
    case 3:
      return "success";
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

const ModalTask = ({ task, open, setOpen, onDeleted }: ModalTaskProps) => {
  const { palette } = useTheme();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const { data: todoData } = useTodoQuery();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();

  const columns = todoData?.columns || [
    { id: 1, title: "Planned" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Done" },
  ];

  const handleEdit = () => {
    form.setFieldsValue({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      columnId: task.columnId,
      progress: task.progress ?? 0,
    });
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      await updateMutation.mutateAsync({
        taskId: task.id,
        taskData: {
          title: values.title,
          description: values.description || undefined,
          dueDate: values.dueDate?.format("YYYY-MM-DD"),
          columnId: values.columnId,
          progress: values.progress,
          status: columns.find((c) => c.id === values.columnId)?.title ?? task.status,
        },
      });
      message.success("Task updated");
      setEditing(false);
    } catch (e) {
      if (e instanceof Error && e.message.includes("400")) return;
      message.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(task.id);
      message.success("Task deleted");
      setOpen(false);
      onDeleted?.();
    } catch {
      message.error("Failed to delete task");
    }
  };

  const handleCancelEdit = () => {
    form.resetFields();
    setEditing(false);
  };

  return (
    <Modal
      title={editing ? "Edit Task" : "Task detail"}
      open={open}
      onCancel={() => {
        if (editing) handleCancelEdit();
        setOpen(false);
      }}
      footer={
        editing ? (
          <Space>
            <Button onClick={handleCancelEdit}>Cancel</Button>
            <Button
              type="primary"
              loading={updateMutation.isPending}
              onClick={handleSaveEdit}
              style={{
                background: palette.primary,
                borderColor: palette.primary,
              }}
            >
              Save
            </Button>
          </Space>
        ) : (
          <Space>
            <Popconfirm
              title="Delete this task?"
              description="This action cannot be undone."
              onConfirm={handleDelete}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
            >
              <Button danger icon={<DeleteOutlined />} loading={deleteMutation.isPending}>
                Delete
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
              style={{
                background: palette.primary,
                borderColor: palette.primary,
              }}
            >
              Edit
            </Button>
          </Space>
        )
      }
      width={560}
      styles={{
        body: {
          background: palette.cardBg,
          border: `1px solid ${palette.border}`,
        },
        header: {
          borderBottom: `1px solid ${palette.border}`,
          color: palette.text,
        },
        body: {
          color: palette.text,
        },
      }}
    >
      {editing ? (
        <Form form={form} layout="vertical" onFinish={handleSaveEdit}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Task title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Description" />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="columnId" label="Status" rules={[{ required: true }]}>
            <Select
              options={columns.map((c) => ({ label: c.title, value: c.id }))}
              placeholder="Status"
            />
          </Form.Item>
          <Form.Item
            name="progress"
            label="Progress (%)"
            rules={[{ type: "number", min: 0, max: 100 }]}
          >
            <Input type="number" min={0} max={100} placeholder="0" />
          </Form.Item>
        </Form>
      ) : (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Text
              strong
              style={{
                fontSize: 16,
                color: palette.text,
                textDecoration: task.progress === 100 ? "line-through" : "none",
                opacity: task.progress === 100 ? 0.7 : 1,
              }}
            >
              {task.title}
            </Text>
          </div>

          {task.description && (
            <p
              style={{
                color: palette.textSecondary,
                marginBottom: 16,
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {task.description}
            </p>
          )}

          <Space wrap size="middle" style={{ marginBottom: 16 }}>
            <Tag color={getStatusColor(task.columnId)} style={{ borderRadius: 6 }}>
              {getStatusText(task.columnId)}
            </Tag>
            {task.priority ? <TagPriority id={task.priority} /> : null}
          </Space>

          {(task.progress ?? 0) > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                Progress
              </Text>
              <TaskProgress percent={task.progress ?? 0} />
            </div>
          )}

          <Descriptions
            column={1}
            size="small"
            labelStyle={{ color: palette.textSecondary, width: 100 }}
            contentStyle={{ color: palette.text }}
          >
            {task.dueDate && (
              <Descriptions.Item
                label={
                  <Space size={4}>
                    <CalendarOutlined />
                    Due date
                  </Space>
                }
              >
                {formatDate(task.dueDate, "DD MMM YYYY")}
              </Descriptions.Item>
            )}
            {(task.comments ?? 0) > 0 && (
              <Descriptions.Item
                label={
                  <Space size={4}>
                    <CommentOutlined />
                    Comments
                  </Space>
                }
              >
                {task.comments}
              </Descriptions.Item>
            )}
            {(task.views ?? 0) > 0 && (
              <Descriptions.Item
                label={
                  <Space size={4}>
                    <EyeOutlined />
                    Views
                  </Space>
                }
              >
                {task.views}
              </Descriptions.Item>
            )}
          </Descriptions>

          {task.assignees && task.assignees.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
                Assignees
              </Text>
              <Space wrap>
                {task.assignees.map((a, idx) => (
                  <Tag key={idx} style={{ borderRadius: 6 }}>
                    {typeof a === "string" ? a : String(a)}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ModalTask;
