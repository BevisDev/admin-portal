import type { Column, Task } from "@/types/todo/Board";
import { MoreOutlined } from "@ant-design/icons";
import { Card } from "antd";
import TaskCard from "./TaskCard";
import SortableTask from "./SortableTask";

interface ColumnCardProps {
  col: Column;
  tasks: Task[];
}

const ColumnCard: React.FC<ColumnCardProps> = ({ col, tasks }) => {
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
          <span>{col.title}</span>
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
        <SortableTask key={task.id} id={task.id}>
          <TaskCard key={task.id} task={task} />
        </SortableTask>
      ))}
    </Card>
  );
};

export default ColumnCard;
