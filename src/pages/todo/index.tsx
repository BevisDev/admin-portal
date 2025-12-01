import { Avatar, Button, Input } from "antd";
import Tab from "./components/Tab";
import {
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { GetTodo } from "@/api/TodoApi";
import ColumnCard from "./components/ColumnCard";

const ToDo = () => {
  const { data } = GetTodo();

  return (
    <div>
      {/* Tabs */}
      <Tab />

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

        <Avatar.Group maxCount={3} maxStyle={{ background: "#111" }}>
          <Avatar style={{ background: "#00B894" }}>AK</Avatar>
          <Avatar style={{ background: "#6C5CE7" }}>BD</Avatar>
          <Avatar style={{ background: "#0984E3" }}>DL</Avatar>
        </Avatar.Group>

        <Button>Add assignee</Button>
      </div>

      {/* Board Columns */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {data &&
          data.columns.map((col) => <ColumnCard key={col.id} col={col} />)}
      </div>
    </div>
  );
};

export default ToDo;
