import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: number | string;
  children: React.ReactNode;
}

const SortableItem = ({ id, children }: SortableItemProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id.toString() });

  const pointerEvents: React.CSSProperties["pointerEvents"] = isDragging
    ? "none"
    : "auto";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : "auto",
    pointerEvents,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default SortableItem;
