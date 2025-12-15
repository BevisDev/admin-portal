import { useDroppable } from "@dnd-kit/core";

interface DroppableItemProps {
  id: number | string;
  children: React.ReactNode;
}

const DroppableItem = ({ id, children }: DroppableItemProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-${id}`,
  });

  return (
    <div ref={setNodeRef} style={{ position: "relative" }}>
      {isOver && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            border: "2px dashed #6C5CE7",
            pointerEvents: "none",
          }}
        />
      )}
      {children}
    </div>
  );
};

export default DroppableItem;
