import type { Task } from "@/types/todo/board";
import { CalendarOutlined } from "@ant-design/icons";
import { Card, Space } from "antd";

const TaskCard: React.FC<{
  task: Task;
}> = ({ task }) => {
  return (
    <Card
      size="small"
      style={{
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <h4 style={{ marginBottom: 6, fontWeight: 600 }}>{task.title}</h4>

      {task.description && (
        <p style={{ color: "#6b7280", marginBottom: 10 }}>{task.description}</p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Space>
          <CalendarOutlined />
          <span style={{ fontSize: 13 }}>
            {task.dueDate}
            {/* {task.dueDate ? dayjs(task.dueDate).format("DD MMM") : "-"} */}
          </span>
        </Space>

        <div
          style={{
            padding: "2px 8px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            background: task.progress === 100 ? "#e7f9ed" : "#eef6ff",
            color: task.progress === 100 ? "#16a34a" : "#3b82f6",
          }}
        >
          {task.progress}%
        </div>
      </div>

      {/* Footer */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Avatar.Group maxCount={3}>
          {task.assignees.map((uid) => {
            const u = userMap[uid];
            const bg = "#6C5CE7";
            return (
              <Avatar key={uid} style={{ background: bg }}>
                {u.initials}
              </Avatar>
            );
          })}
        </Avatar.Group>

        <Space size={16} style={{ color: "#94a3b8" }}>
          <span>
            <EyeOutlined /> {task.views}
          </span>
          <span>
            <MessageOutlined /> {task.comments}
          </span>
        </Space>
      </div> */}
    </Card>
  );
};

export default TaskCard;
