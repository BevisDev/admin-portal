import { GetTodo } from "@/api/TodoApi";
import { Avatar, Button, Flex, Input, Tabs } from "antd";
import BoardView from "./components/BoardView";
import {
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import TodoView from "./components/TodoView";
import TableView from "./components/TableView";
import { useEffect, useState } from "react";
import type { Column, Task } from "@/types/todo/Board";
import ModalTask from "./components/ModalTask";
import { GetTheme } from "@/hooks/useTheme";

const ToDo = () => {
  const { mode } = GetTheme();
  const { data, isLoading } = GetTodo();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cols, setCols] = useState<Column[]>([]);
  const [openModalTask, setOpenModalTask] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setTasks(data?.tasks);
      setCols(data?.columns);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Toolbar */}
      <Flex
        gap={12}
        align="center"
        style={{
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
          style={{
            background: mode == "dark" ? "#1f1f20ff" : "#f0f0f0",
          }}
          icon={<PlusOutlined />}
          onClick={() => setOpenModalTask(true)}
        >
          Add Task
        </Button>

        <ModalTask open={openModalTask} onClose={setOpenModalTask} />

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
      </Flex>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="board"
        items={[
          {
            key: "board",
            label: "Board",
            children: (
              <BoardView tasks={tasks} setTasks={setTasks} cols={cols} />
            ),
          },
          {
            key: "todo",
            label: "To-do",
            children: <TodoView tasks={tasks} />,
          },
          {
            key: "table",
            label: "Table",
            children: <TableView tasks={tasks} />,
          },
          { key: "list", label: "List" },
        ]}
      />
    </div>
  );
};

export default ToDo;
