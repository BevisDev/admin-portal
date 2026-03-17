import type { Task } from "@/types/todo/Board";
import { Avatar, Progress, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { formatDate } from "@/utils/date";
import TagPriority from "./TagPriority";
import dayjs from "dayjs";
import { useState } from "react";
import ModalTask from "./ModalTask";

interface TableViewProps {
  tasks: Task[];
}

// Helper to get status color and text
const getStatusInfo = (columnId: number) => {
  switch (columnId) {
    case 1:
      return { color: "default", text: "Planned" };
    case 2:
      return { color: "processing", text: "In Progress" };
    case 3:
      return { color: "success", text: "Done" };
    default:
      return { color: "default", text: "Unknown" };
  }
};

const TableView = ({ tasks }: TableViewProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const columns: ColumnsType<Task> = [
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 280,
      render: (text: string, record: Task) => (
        <div>
          <div
            style={{
              fontWeight: 500,
              marginBottom: 4,
              cursor: "pointer",
              color: record.progress === 100 ? "#999" : undefined,
              textDecoration: record.progress === 100 ? "line-through" : "none",
            }}
            onClick={() => handleRowClick(record)}
          >
            {text}
          </div>
          {record.description && (
            <div
              style={{
                fontSize: 12,
                color: "#999",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "columnId",
      key: "status",
      width: 130,
      render: (colId: number) => {
        const { color, text } = getStatusInfo(colId);
        return (
          <Tag color={color} style={{ borderRadius: 6 }}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: "Planned", value: 1 },
        { text: "In Progress", value: 2 },
        { text: "Done", value: 3 },
      ],
      onFilter: (value, record) => record.columnId === value,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority: number | undefined) =>
        priority ? <TagPriority id={priority} /> : "-",
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      width: 150,
      render: (progress: number | undefined) => {
        const percent = progress ?? 0;
        return (
          <Progress
            percent={percent}
            size="small"
            status={percent === 100 ? "success" : "active"}
            showInfo
            style={{ minWidth: 100 }}
          />
        );
      },
      sorter: (a, b) => (a.progress ?? 0) - (b.progress ?? 0),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 140,
      render: (date: string | undefined) =>
        date ? formatDate(date, "DD MMM YYYY") : "-",
      sorter: (a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix();
      },
    },
    {
      title: "Assignees",
      dataIndex: "assignees",
      key: "assignees",
      width: 120,
      render: (assignees: string[] | undefined) => {
        if (!assignees || assignees.length === 0) return "-";
        return (
          <Avatar.Group maxCount={3} size="small">
            {assignees.slice(0, 3).map((assignee, idx) => (
              <Avatar
                key={idx}
                size="small"
                style={{
                  backgroundColor: [
                    "#00B894",
                    "#6C5CE7",
                    "#0984E3",
                    "#FDCB6E",
                    "#E17055",
                  ][idx % 5],
                }}
              >
                {typeof assignee === "string"
                  ? assignee.slice(0, 2).toUpperCase()
                  : String(assignee).slice(0, 2)}
              </Avatar>
            ))}
          </Avatar.Group>
        );
      },
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      width: 80,
      align: "center",
      render: (views: number | undefined) => views ?? 0,
      sorter: (a, b) => (a.views ?? 0) - (b.views ?? 0),
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: 100,
      align: "center",
      render: (comments: number | undefined) => comments ?? 0,
      sorter: (a, b) => (a.comments ?? 0) - (b.comments ?? 0),
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        dataSource={tasks}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} tasks`,
        }}
        scroll={{ x: 1200 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
      />

      {/* Modal Task Detail */}
      {selectedTask && (
        <ModalTask
          task={selectedTask}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      )}
    </>
  );
};

export default TableView;
