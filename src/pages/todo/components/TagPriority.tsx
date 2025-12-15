import { getConfigStore } from "@/store/ConfigStore";
import { Tag } from "antd";

interface TagPriority {
  id: number;
}

const TagPriority = ({ id }: TagPriority) => {
  const priorityMap = getConfigStore((s) => s.priorityMap);
  const priority = priorityMap[id] ?? priorityMap[2];

  return (
    <Tag
      color={priority.color}
      style={{
        fontSize: 11,
        fontWeight: 500,
        margin: 0,
        borderRadius: 6,
      }}
    >
      {priority.label}
    </Tag>
  );
};

export default TagPriority;
