import type { Task } from "@/types/todo/Board";
import { CalendarOutlined } from "@ant-design/icons";
import { Card, Flex, Space } from "antd";
import TagPriority from "./TagPriority";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
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
        <p
          style={{
            color: "#6b7280",
            marginBottom: 10,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </p>
      )}

      <Flex
        justify="space-between"
        style={{
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

        <TagPriority id={task.priority} />
        {/* <TaskProgress percent={task.progress ?? 0} /> */}
      </Flex>

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
