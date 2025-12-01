import { Tabs } from "antd";

const Tab = () => {
  return (
    <Tabs
      defaultActiveKey="board"
      items={[
        { key: "board", label: "Board" },
        { key: "todo", label: "To-do" },
        { key: "table", label: "Table" },
        { key: "list", label: "List" },
      ]}
    />
  );
};

export default Tab;
