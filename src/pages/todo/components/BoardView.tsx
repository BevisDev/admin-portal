import type { Column, Task, Todo } from "@/types/todo/Board";
import ColumnCard from "./ColumnCard";
import { useEffect, useMemo, useState } from "react";
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
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

interface BoardViewProps {
  data?: Todo;
  onMoveTask?: (
    taskId: number,
    fromColId: number,
    toColId: number,
    newIdx: number
  ) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ data, onMoveTask }) => {
  const [cols, setCols] = useState<Column[]>(data?.columns ?? []);
  const [tasks, setTasks] = useState<Task[]>(data?.tasks ?? []);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    if (data) {
      setCols(data.columns);
      setTasks(data.tasks);
    }
  }, [data]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const overId = Number(over.id);

    const activeTask = tasks.find((t) => t.id === taskId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask || !overTask) return;

    const fromColId = activeTask.columnId;
    const toColId = overTask.columnId;

    // ==== Rebuild tasks array ====
    const newTasks = [...tasks];

    // Remove
    newTasks.splice(
      newTasks.findIndex((t) => t.id === taskId),
      1
    );

    // Insert
    const insertIndex = newTasks.findIndex((t) => t.id === overId);
    newTasks.splice(insertIndex, 0, { ...activeTask, columnId: toColId });

    setTasks(newTasks);

    // Gọi API callback
    onMoveTask?.(taskId, fromColId, toColId, insertIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        const id = Number(active.id);
        setActiveTask(tasks.find((t) => t.id === id) ?? null);
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveTask(null);
      }}
      onDragCancel={() => setActiveTask(null)}
    >
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "flex-start",
          overflowX: "auto",
          paddingBottom: 24,
        }}
      >
        {cols.map((col) => (
          <SortableContext
            key={col.id}
            items={(tasksByColumn[col.id] ?? []).map((t) => t.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <ColumnCard col={col} tasks={tasksByColumn[col.id] ?? []} />
          </SortableContext>
        ))}
      </div>

      {/* OVERLAY */}
      <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
    </DndContext>
  );
};

export default BoardView;
