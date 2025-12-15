import type { Task } from "@/types/todo/Board";
import { Checkbox, List, Space, Tag } from "antd";

interface TodoViewProps {
  tasks: Task[];
}

const TodoView = ({ tasks }: TodoViewProps) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={tasks}
      renderItem={(task) => {
        const isDone = task.progress === 100;

        return (
          <List.Item
            style={{
              padding: "14px 10px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* LEFT SIDE */}
            <Space align="start">
              {/* Checkbox */}
              <Checkbox checked={isDone} />

              {/* Title + Status */}
              <div>
                <div
                  style={{
                    fontWeight: 500,
                    // color: isDone ? "#9ca3af" : "#111",
                    textDecoration: isDone ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </div>

                <Space style={{ marginTop: 4 }}>
                  {/* Status tag (map columnId → status text if needed) */}
                  <Tag color="blue" style={{ borderRadius: 999 }}>
                    {isDone ? "Done" : "In Progress"}
                  </Tag>

                  {/* Due date */}
                  {task.dueDate && (
                    <span style={{ color: "#6b7280", fontSize: 13 }}>
                      {/* {dayjs(task.dueDate).format("DD MMM")} */}
                    </span>
                  )}
                </Space>
              </div>
            </Space>

            {/* RIGHT SIDE */}
            {/* <Avatar.Group maxCount={3}>
              {task.assignees.map((uid) => {
                const u = userMap[uid];
                return (
                  <Avatar key={uid} style={{ background: "#6C5CE7" }}>
                    {u.initials}
                  </Avatar>
                );
              })}
            </Avatar.Group> */}
          </List.Item>
        );
      }}
    />
  );
};

export default TodoView;
