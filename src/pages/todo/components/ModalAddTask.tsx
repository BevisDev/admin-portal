import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  message,
} from "antd";
import { useTodoQuery, useCreateTaskMutation } from "@/api/todo";
import { useConstantStore } from "@/store/useConstantStore";
import useTheme from "@/hooks/useTheme";
import type { Task } from "@/types/todo/Board";

const { TextArea } = Input;

interface ModalAddTaskProps {
  colId: number;
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
  title: string;
  description?: string;
  dueDate?: ReturnType<typeof import("dayjs")>;
  priority: number;
  columnId: number;
  progress?: number;
}

const ModalAddTask = ({ colId, open, onClose }: ModalAddTaskProps) => {
  const { palette } = useTheme();
  const [form] = Form.useForm<FormValues>();
  const { data: constants } = useConstantStore();
  const { data: todoData } = useTodoQuery();
  const createTaskMutation = useCreateTaskMutation();

  const columns = todoData?.columns || [
    { id: 1, title: "Planned" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Done" },
  ];

  const handleFinish = async (values: FormValues) => {
    try {
      const newTask: Omit<Task, "id"> = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate?.format("YYYY-MM-DD"),
        priority: values.priority,
        columnId: values.columnId,
        progress: values.progress ?? 0,
        status: columns.find((c) => c.id === values.columnId)?.title ?? "",
        assignees: [],
        comments: 0,
        views: 0,
      };
      await createTaskMutation.mutateAsync(newTask);
      message.success("Task created");
      form.resetFields();
      form.setFieldsValue({ columnId: colId, priority: 1, progress: 0 });
      onClose(false);
    } catch {
      message.error("Failed to create task");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    form.setFieldsValue({ columnId: colId, priority: 1, progress: 0 });
    onClose(false);
  };

  return (
    <Modal
      title="Create Task"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={480}
      styles={{
        body: {
          background: palette.cardBg,
          border: `1px solid ${palette.border}`,
        },
        header: {
          borderBottom: `1px solid ${palette.border}`,
          color: palette.text,
        },
      }}
      afterOpenChange={(visible) => {
        if (visible) {
          form.setFieldsValue({
            columnId: colId,
            priority: 1,
            progress: 0,
          });
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          columnId: colId,
          priority: 1,
          progress: 0,
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter task title" }]}
        >
          <Input placeholder="Task title..." />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Task description..." />
        </Form.Item>

        <Space.Compact style={{ width: "100%", gap: 16 }} block>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true }]}
            style={{ flex: 1, minWidth: 0 }}
          >
            <Select
              placeholder="Priority"
              options={
                constants?.priorities?.map((p) => ({
                  label: p.label,
                  value: p.id,
                })) ?? []
              }
            />
          </Form.Item>
          <Form.Item
            name="columnId"
            label="Status"
            rules={[{ required: true }]}
            style={{ flex: 1, minWidth: 0 }}
          >
            <Select
              placeholder="Status"
              options={columns.map((c) => ({ label: c.title, value: c.id }))}
            />
          </Form.Item>
        </Space.Compact>

        <Space.Compact style={{ width: "100%", gap: 16 }} block>
          <Form.Item name="dueDate" label="Due Date" style={{ flex: 1, minWidth: 0 }}>
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="Due date"
            />
          </Form.Item>
          <Form.Item
            name="progress"
            label="Progress (%)"
            style={{ flex: 1, minWidth: 0 }}
            rules={[{ type: "number", min: 0, max: 100 }]}
          >
            <Input type="number" min={0} max={100} placeholder="0" />
          </Form.Item>
        </Space.Compact>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createTaskMutation.isPending}
              style={{
                background: palette.primary,
                borderColor: palette.primary,
              }}
            >
              Create Task
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddTask;
