import type { Column } from "@/types/todo/board";
import { MoreOutlined } from "@ant-design/icons";
import { Card } from "antd";
import TaskCard from "./TaskCard";

const ColumnCard: React.FC<{
  col: Column;
}> = ({ col }) => {
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
      bodyStyle={{ padding: 16 }}
    >
      {col.tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </Card>
  );
};

export default ColumnCard;
