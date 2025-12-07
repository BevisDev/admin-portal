import { GetTodo } from "@/api/TodoApi";
import { Avatar, Button, Input, Tabs } from "antd";
import BoardView from "./components/BoardView";
import {
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import TodoView from "./components/TodoView";
import TableView from "./components/TableView";

const ToDo = () => {
  const { data } = GetTodo();

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search anything..."
          style={{ width: 350 }}
        />

        <Button icon={<FilterOutlined />}>Filter</Button>
        <Button icon={<ShareAltOutlined />}>Share</Button>

        <Button
          type="primary"
          style={{ background: "#111" }}
          icon={<PlusOutlined />}
        >
          Add New
        </Button>

        <Avatar.Group
          max={{
            count: 3,
            style: {
              background: "#111",
            },
          }}
        >
          <Avatar style={{ background: "#00B894" }}>AK</Avatar>
          <Avatar style={{ background: "#6C5CE7" }}>BD</Avatar>
          <Avatar style={{ background: "#0984E3" }}>DL</Avatar>
        </Avatar.Group>

        <Button>Add assignee</Button>
      </div>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="board"
        items={[
          {
            key: "board",
            label: "Board",
            children: <BoardView data={data} />,
          },
          {
            key: "todo",
            label: "To-do",
            children: <TodoView tasks={data?.tasks || []} />,
          },
          {
            key: "table",
            label: "Table",
            children: <TableView tasks={data?.tasks || []} />,
          },
          { key: "list", label: "List" },
        ]}
      />
    </div>
  );
};

export default ToDo;
