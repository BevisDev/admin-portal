import {
  Avatar,
  Button,
  DatePicker,
  Dropdown,
  Flex,
  Input,
  Select,
  Space,
  Tabs,
} from "antd";

const { RangePicker } = DatePicker;
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
import type { Column } from "@/types/todo/Board";
import { useTodoQuery } from "@/api/todo";
import { useNavigate } from "react-router-dom";
import useTheme from "@/hooks/useTheme";
import dayjs, { type Dayjs } from "dayjs";

const ToDoPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterDateRange, setFilterDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const { palette } = useTheme();

  // Build query options for API call
  const queryOptions = {
    search: searchQuery.trim() || undefined,
    startDate:
      filterDateRange && filterDateRange[0]
        ? filterDateRange[0].format("YYYY-MM-DD")
        : undefined,
    endDate:
      filterDateRange && filterDateRange[1]
        ? filterDateRange[1].format("YYYY-MM-DD")
        : undefined,
    status: filterStatus,
  };

  // Call API with filters - API will handle filtering
  const { data, isLoading } = useTodoQuery(queryOptions);
  const [cols, setCols] = useState<Column[]>([]);

  useEffect(() => {
    if (data) {
      setCols(data?.columns);
    }
  }, [data]);

  const tasks = data?.tasks || [];

  // Check if any filter is active
  const hasActiveFilters =
    (filterDateRange !== null &&
      filterDateRange[0] !== null &&
      filterDateRange[1] !== null) ||
    filterStatus !== undefined;

  // Clear all filters
  const handleClearFilters = () => {
    setFilterDateRange(null);
    setFilterStatus(undefined);
  };

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
          placeholder="Search tasks by title or description..."
          style={{ width: 350 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />

        <Dropdown
          trigger={["click"]}
          dropdownRender={() => (
            <div
              style={{
                background: palette.cardBg,
                padding: 16,
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: 300,
                border: `1px solid ${palette.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <div>
                  <div
                    style={{
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      color: palette.text,
                    }}
                  >
                    Filter by Date Range
                  </div>
                  <RangePicker
                    style={{ width: "100%" }}
                    value={filterDateRange}
                    onChange={(dates) => {
                      if (dates) {
                        setFilterDateRange([dates[0], dates[1]]);
                      } else {
                        setFilterDateRange(null);
                      }
                    }}
                    format="YYYY-MM-DD"
                    placeholder={["From date", "To date"]}
                    allowClear
                  />
                </div>

                <div>
                  <div
                    style={{
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      color: palette.text,
                    }}
                  >
                    Filter by Status
                  </div>
                  <Select
                    style={{ width: "100%" }}
                    value={filterStatus}
                    onChange={(value) => setFilterStatus(value)}
                    placeholder="Select status"
                    allowClear
                    options={cols.map((col) => ({
                      label: col.title,
                      value: col.id,
                    }))}
                  />
                </div>

                {hasActiveFilters && (
                  <Button
                    type="link"
                    onClick={handleClearFilters}
                    style={{ padding: 0, width: "100%", textAlign: "left" }}
                  >
                    Clear all filters
                  </Button>
                )}
              </Space>
            </div>
          )}
        >
          <Button
            icon={<FilterOutlined />}
            type={hasActiveFilters ? "primary" : "default"}
          >
            Filter
            {hasActiveFilters && " *"}
          </Button>
        </Dropdown>
        <Button icon={<ShareAltOutlined />}>Share</Button>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/todo/create")}
          style={{
            background: palette.primary,
            borderColor: palette.primary,
          }}
        >
          Add Task
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
      </Flex>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="board"
        items={[
          {
            key: "board",
            label: "Board",
            children: (
              <BoardView
                tasks={tasks}
                cols={cols}
                filterDateRange={filterDateRange}
              />
            ),
          },
          {
            key: "todo",
            label: "To-do",
            children: (
              <TodoView tasks={tasks} filterDateRange={filterDateRange} />
            ),
          },
          {
            key: "table",
            label: "Table",
            children: <TableView tasks={tasks} />,
          },
        ]}
      />
    </div>
  );
};

export default ToDoPage;
