import type { Task } from "@/types/todo/Board";
import { CalendarOutlined } from "@ant-design/icons";
import { Card, Flex, Space } from "antd";
import TagPriority from "./TagPriority";
import { formatDate } from "@/utils/date";
import { useState } from "react";
import ModalTask from "./ModalTask";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Card
      size="small"
      style={{
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <h4
        className="hover:text-blue-500"
        style={{
          marginBottom: 6,
          fontWeight: 600,
          cursor: "pointer",
          transition: "color 0.2s",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {task.title}
      </h4>

      {open && <ModalTask task={task} open={open} setOpen={setOpen} />}

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
            {task.dueDate ? formatDate(task.dueDate, "DD MMM") : "-"}
          </span>
        </Space>

        <TagPriority id={task.priority} />
      </Flex>
    </Card>
  );
};

export default TaskCard;
