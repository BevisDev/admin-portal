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
import dayjs, { type Dayjs } from "dayjs";
import { useMoveTaskMutation } from "@/api/todo";

interface BoardViewProps {
  tasks: Task[];
  cols: Column[];
  filterDateRange?: [Dayjs | null, Dayjs | null] | null;
}

const BoardView = ({ tasks, cols, filterDateRange }: BoardViewProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const moveTaskMutation = useMoveTaskMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );

  // Filter tasks: if filterDateRange is set, use it; otherwise use 2 weeks range
  const filteredTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    // If user has selected a date range filter, don't apply default date range filter
    // (tasks are already filtered by date range in parent component)
    if (
      filterDateRange &&
      filterDateRange[0] !== null &&
      filterDateRange[1] !== null
    ) {
      return tasks;
    }

    // Default: show tasks from 2 weeks ago to 2 weeks later (4 weeks total)
    const today = dayjs().startOf("day");
    const twoWeeksAgo = today.subtract(2, "weeks").startOf("day");
    const twoWeeksLater = today.add(2, "weeks").endOf("day");

    const filtered = tasks.filter((task) => {
      // If task has no dueDate, don't show it
      if (!task.dueDate) {
        return false;
      }

      const taskDate = dayjs(task.dueDate).startOf("day");

      // Show task if dueDate is within 2 weeks ago to 2 weeks later (inclusive)
      const isAfterStart =
        taskDate.isSame(twoWeeksAgo) || taskDate.isAfter(twoWeeksAgo);
      const isBeforeEnd =
        taskDate.isSame(twoWeeksLater) || taskDate.isBefore(twoWeeksLater);

      return isAfterStart && isBeforeEnd;
    });

    // If no tasks match filter, show all tasks with dueDate (fallback)
    if (filtered.length === 0) {
      return tasks.filter((task) => task.dueDate);
    }

    return filtered;
  }, [tasks, filterDateRange]);

  const tasksByColumn = useMemo(() => {
    const map: Record<number, Task[]> = {};
    filteredTasks.forEach((t) => {
      if (!map[t.columnId]) {
        map[t.columnId] = [];
      }

      map[t.columnId].push(t);
    });

    return map;
  }, [filteredTasks]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const taskId = Number(active.id);
      // Find task in all tasks (not filtered)
      const activeTask = tasks.find((t) => t.id === taskId);
      if (!activeTask) return;

      const overIdStr = over.id.toString();

      // DROP INTO EMPTY COLUMN
      if (overIdStr.startsWith("drop")) {
        const newColId = Number(overIdStr.replace("drop-", ""));

        // Call API to move task
        try {
          await moveTaskMutation.mutateAsync({
            taskId,
            fromColId: activeTask.columnId,
            toColId: newColId,
            newIndex: 0,
          });
        } catch (error) {
          console.error("Failed to move task:", error);
        }

        setActiveTask(null);
        return;
      }

      // DROP ONTO A TASK
      const overId = Number(overIdStr);
      const overTask = filteredTasks.find((t) => t.id === overId);
      if (!overTask) return;

      const fromColId = activeTask.columnId;
      const toColId = overTask.columnId;

      // REORDER INSIDE SAME COLUMN
      if (fromColId === toColId) {
        // Get all tasks in this column (from all tasks)
        const allColumnTasks = tasks.filter((t) => t.columnId === fromColId);
        const oldIndex = allColumnTasks.findIndex((t) => t.id === taskId);
        const newIndex = allColumnTasks.findIndex((t) => t.id === overId);

        if (oldIndex === -1 || newIndex === -1) return;

        // Call API to reorder task
        try {
          await moveTaskMutation.mutateAsync({
            taskId,
            fromColId,
            toColId,
            newIndex,
          });
        } catch (error) {
          console.error("Failed to reorder task:", error);
        }

        setActiveTask(null);
        return;
      }

      // MOVE TO ANOTHER COLUMN
      // Find the index in the filtered view to determine insert position
      const filteredToColumnTasks = filteredTasks.filter((t) => t.columnId === toColId);
      const insertIndexInFiltered = filteredToColumnTasks.findIndex((t) => t.id === overId);

      // Find corresponding task in all tasks
      const toColumnTasks = tasks.filter((t) => t.columnId === toColId);
      let insertIndex = 0;
      if (insertIndexInFiltered >= 0 && insertIndexInFiltered < filteredToColumnTasks.length) {
        const targetTaskInFiltered = filteredToColumnTasks[insertIndexInFiltered];
        insertIndex = toColumnTasks.findIndex((t) => t.id === targetTaskInFiltered.id);
      }
      if (insertIndex === -1) insertIndex = toColumnTasks.length;

      // Call API to move task
      try {
        await moveTaskMutation.mutateAsync({
          taskId,
          fromColId,
          toColId,
          newIndex: insertIndex,
        });
      } catch (error) {
        console.error("Failed to move task:", error);
      }

      // remove task active
      setActiveTask(null);
    },
    [tasks, filteredTasks, moveTaskMutation]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        const id = Number(active.id);
        setActiveTask(filteredTasks.find((t) => t.id === id) ?? null);
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
