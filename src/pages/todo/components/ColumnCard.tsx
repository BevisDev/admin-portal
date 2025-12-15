import type { Column, Task } from "@/types/todo/Board";
import { MoreOutlined } from "@ant-design/icons";
import { Card } from "antd";
import TaskCard from "./TaskCard";
import SortableItem from "@/components/dnd/SortableItem";

interface ColumnCardProps {
  col: Column;
  tasks: Task[];
}

const ColumnCard = ({ col, tasks }: ColumnCardProps) => {
  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          <span>
            {col.title} ({col.total})
          </span>
          <MoreOutlined style={{ cursor: "pointer" }} />
        </div>
      }
      style={{
        width: 320,
        minWidth: 320,
        borderRadius: 16,
        borderColor: "#EEE",
      }}
      styles={{
        body: {
          padding: 16,
        },
      }}
    >
      {tasks.map((task) => (
        <SortableItem key={task.id} id={task.id}>
          <TaskCard key={task.id} task={task} />
        </SortableItem>
      ))}
    </Card>
  );
};

export default ColumnCard;
