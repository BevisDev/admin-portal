import type { Column, Task } from "@/types/todo/Board";
import ColumnCard from "./ColumnCard";
import { useCallback, useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import DroppableItem from "@/components/dnd/DroppableItem";
import { Flex } from "antd";
import { getConfigStore } from "@/store/ConfigStore";

interface BoardViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  cols: Column[];
  onMoveTask?: (
    taskId: number,
    fromColId: number,
    toColId: number,
    newIdx: number
  ) => void;
}

const BoardView = ({ tasks, setTasks, cols, onMoveTask }: BoardViewProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );

  const tasksByColumn = useMemo(() => {
    const map: Record<number, Task[]> = {};
    tasks.forEach((t) => {
      if (!map[t.columnId]) {
        map[t.columnId] = [];
      }

      map[t.columnId].push(t);
    });

    return map;
  }, [tasks]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const taskId = Number(active.id);
      const activeTask = tasks.find((t) => t.id === taskId);
      if (!activeTask) return;

      const overIdStr = over.id.toString();

      // DROP INTO EMPTY COLUMN
      if (overIdStr.startsWith("drop")) {
        const newColId = Number(overIdStr.replace("drop-", ""));

        setTasks((prev) => [
          ...prev.filter((t) => t.id !== taskId),
          { ...activeTask, columnId: newColId },
        ]);

        setActiveTask(null);
        return;
      }

      // DROP ONTO A TASK
      const overId = Number(overIdStr);
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;

      const fromColId = activeTask.columnId;
      const toColId = overTask.columnId;

      // REORDER INSIDE SAME COLUMN
      if (fromColId === toColId) {
        const columnTasks = tasks.filter((t) => t.columnId === fromColId);
        const oldIndex = columnTasks.findIndex((t) => t.id === taskId);
        const newIndex = columnTasks.findIndex((t) => t.id === overId);

        const reordered = arrayMove(columnTasks, oldIndex, newIndex);

        setTasks((prev) => [
          ...prev.filter((t) => t.columnId !== fromColId),
          ...reordered,
        ]);

        setActiveTask(null);
        return;
      }

      // MOVE TO ANOTHER COLUMN
      const fromColumnTasks = tasks.filter((t) => t.columnId === fromColId);
      const toColumnTasks = tasks.filter((t) => t.columnId === toColId);

      // remove from old column
      const removed = fromColumnTasks.filter((t) => t.id !== taskId);

      // insert into new column (correct index)
      const insertIndex = toColumnTasks.findIndex((t) => t.id === overId);
      toColumnTasks.splice(insertIndex, 0, {
        ...activeTask,
        columnId: toColId,
      });

      // merge all back
      const rebuilt = [
        ...tasks.filter(
          (t) => t.columnId !== fromColId && t.columnId !== toColId
        ),
        ...removed,
        ...toColumnTasks,
      ];

      setTasks(rebuilt);
      // Gọi API callback
      onMoveTask?.(taskId, fromColId, toColId, insertIndex);

      // remove task active
      setActiveTask(null);
    },
    [tasks, setTasks, onMoveTask]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        const id = Number(active.id);
        setActiveTask(tasks.find((t) => t.id === id) ?? null);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <Flex
        align="start"
        gap={20}
        style={{
          overflowY: "hidden",
          overflowX: "auto",
          paddingBottom: 24,
        }}
      >
        {cols.map((col) => (
          <DroppableItem key={col.id} id={col.id}>
            <SortableContext
              key={col.id}
              items={(tasksByColumn[col.id] ?? []).map((t) => t.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              <ColumnCard col={col} tasks={tasksByColumn[col.id] ?? []} />
            </SortableContext>
          </DroppableItem>
        ))}
      </Flex>

      {/* OVERLAY */}
      <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
    </DndContext>
  );
};

export default BoardView;
