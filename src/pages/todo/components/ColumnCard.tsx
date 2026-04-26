import type { Column, Task } from "@/models/todo/Board";
import { PlusOutlined } from "@ant-design/icons";
import { Card, Tooltip } from "antd";
import TaskCard from "./TaskCard";
import SortableItem from "@/components/dnd/SortableItem";
import { useState } from "react";
import ModalAddTask from "./ModalAddTask";
import useTheme from "@/hooks/useTheme";

interface ColumnCardProps {
  col: Column;
  tasks: Task[];
}

const ColumnCard = ({ col, tasks }: ColumnCardProps) => {
  const [openModalTask, setOpenModalTask] = useState<boolean>(false);
  const { palette } = useTheme();

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 600,
            fontSize: 15,
            color: palette.text,
          }}
        >
          <span>
            {col.title} ({col.total})
          </span>
          <Tooltip title="Add task">
            <PlusOutlined
              style={{
                cursor: "pointer",
                fontSize: 16,
                color: palette.primary,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpenModalTask(true);
              }}
            />
          </Tooltip>

          <ModalAddTask
            colId={col.id}
            open={openModalTask}
            onClose={setOpenModalTask}
          />
        </div>
      }
      style={{
        width: 320,
        minWidth: 320,
        borderRadius: 16,
        borderColor: palette.border,
        background: palette.cardBg,
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
