import {
    Button,
    Card,
    DatePicker,
    Form,
    Input,
    Select,
    Space,
    Typography,
    message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useConstantStore } from "@/store/useConstantStore";
import useTheme from "@/hooks/useTheme";
import dayjs from "dayjs";
import type { Task } from "@/types/todo/Board";
import { useTodoQuery, useCreateTaskMutation } from "@/api/todo";

const { Title } = Typography;
const { TextArea } = Input;

interface CreateTaskFormValues {
    title: string;
    description?: string;
    dueDate?: dayjs.Dayjs;
    priority: number;
    columnId: number;
    progress?: number;
    assignees?: string[];
}

const CreateTaskPage = () => {
    const navigate = useNavigate();
    const { palette } = useTheme();
    const [form] = Form.useForm<CreateTaskFormValues>();
    const { data: constants } = useConstantStore();
    const { data: todoData, isLoading: isLoadingTodo } = useTodoQuery();
    const createTaskMutation = useCreateTaskMutation();

    // Get columns from API
    const columns = todoData?.columns || [
        { id: 1, title: "Planned" },
        { id: 2, title: "In Progress" },
        { id: 3, title: "Done" },
    ];

    const handleSubmit = async (values: CreateTaskFormValues) => {
        try {
            const newTask: Omit<Task, "id"> = {
                title: values.title,
                description: values.description,
                dueDate: values.dueDate?.format("YYYY-MM-DD"),
                priority: values.priority,
                columnId: values.columnId,
                progress: values.progress ?? 0,
                status: columns.find((c) => c.id === values.columnId)?.title || "",
                assignees: values.assignees || [],
                comments: 0,
                views: 0,
            };

            // Call API to create task
            await createTaskMutation.mutateAsync(newTask);

            message.success("Task created successfully!");
            navigate("/todo");
        } catch (error) {
            message.error("Failed to create task");
            console.error(error);
        }
    };

    if (isLoadingTodo) {
        return <div>Loading...</div>;
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                padding: "24px 32px",
                background: palette.background,
            }}
        >
            {/* Header */}
            <Space
                style={{
                    marginBottom: 24,
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/todo")}
                    style={{
                        border: "none",
                        boxShadow: "none",
                    }}
                >
                    Back
                </Button>
            </Space>

            <Card
                style={{
                    borderRadius: 12,
                    border: `1px solid ${palette.border}`,
                    background: palette.cardBg,
                }}
            >
                <Title level={2} style={{ marginBottom: 24, color: palette.text }}>
                    Create New Task
                </Title>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        priority: 1,
                        columnId: 1,
                        progress: 0,
                    }}
                >
                    {/* Title */}
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            { required: true, message: "Please enter task title" },
                            { max: 200, message: "Title must be less than 200 characters" },
                        ]}
                    >
                        <Input
                            placeholder="Enter task title..."
                            size="large"
                            style={{
                                borderRadius: 8,
                            }}
                        />
                    </Form.Item>

                    {/* Description */}
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            { max: 1000, message: "Description must be less than 1000 characters" },
                        ]}
                    >
                        <TextArea
                            rows={5}
                            placeholder="Enter task description..."
                            style={{
                                borderRadius: 8,
                            }}
                        />
                    </Form.Item>

                    {/* Row: Priority & Status */}
                    <Space.Compact style={{ width: "100%", gap: 16 }}>
                        <Form.Item
                            label="Priority"
                            name="priority"
                            rules={[{ required: true, message: "Please select priority" }]}
                            style={{ flex: 1 }}
                        >
                            <Select
                                size="large"
                                placeholder="Select priority"
                                style={{ borderRadius: 8 }}
                                options={
                                    constants?.priorities.map((p) => ({
                                        label: p.label,
                                        value: p.id,
                                    })) || []
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label="Status"
                            name="columnId"
                            rules={[{ required: true, message: "Please select status" }]}
                            style={{ flex: 1 }}
                        >
                            <Select
                                size="large"
                                placeholder="Select status"
                                style={{ borderRadius: 8 }}
                                options={columns.map((col) => ({
                                    label: col.title,
                                    value: col.id,
                                }))}
                            />
                        </Form.Item>
                    </Space.Compact>

                    {/* Row: Due Date & Progress */}
                    <Space.Compact style={{ width: "100%", gap: 16 }}>
                        <Form.Item
                            label="Due Date"
                            name="dueDate"
                            style={{ flex: 1 }}
                        >
                            <DatePicker
                                size="large"
                                style={{ width: "100%", borderRadius: 8 }}
                                format="YYYY-MM-DD"
                                placeholder="Select due date"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Progress (%)"
                            name="progress"
                            style={{ flex: 1 }}
                            rules={[
                                { type: "number", min: 0, max: 100 },
                            ]}
                        >
                            <Input
                                type="number"
                                size="large"
                                placeholder="0"
                                min={0}
                                max={100}
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>
                    </Space.Compact>

                    {/* Assignees - Optional for now */}
                    {/* <Form.Item
            label="Assignees"
            name="assignees"
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="Select assignees"
              style={{ borderRadius: 8 }}
              options={[]}
            />
          </Form.Item> */}

                    {/* Actions */}
                    <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
                        <Space>
                            <Button
                                size="large"
                                onClick={() => navigate("/todo")}
                                style={{
                                    borderRadius: 8,
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={createTaskMutation.isPending}
                                style={{
                                    background: palette.primary,
                                    borderColor: palette.primary,
                                    borderRadius: 8,
                                }}
                            >
                                Create Task
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateTaskPage;
