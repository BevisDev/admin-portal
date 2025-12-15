import type { Task } from "@/types/todo/Board";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface TableViewProps {
  tasks: Task[];
}

const TableView = ({ tasks }: TableViewProps) => {
  const columns: ColumnsType<Task> = [
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 260,
    },
    {
      title: "Status",
      dataIndex: "columnId",
      key: "status",
      width: 140,
      render: (colId: number) => {
        const color =
          colId === 3
            ? "green"
            : colId === 2
            ? "blue"
            : colId === 4
            ? "orange"
            : "default";

        const text =
          colId === 1
            ? "Planned"
            : colId === 2
            ? "In Progress"
            : colId === 3
            ? "Done"
            : "On Hold";

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 140,
      // render: (d: string | undefined) => (d ? dayjs(d).format("DD MMM") : "-"),
      // sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      width: 120,
      render: (p: number | undefined) => (p ?? 0) + "%",
      sorter: (a, b) => (a.progress ?? 0) - (b.progress ?? 0),
    },
    {
      title: "Assignees",
      dataIndex: "assignees",
      key: "assignees",
      width: 150,
      // render: (list: number[]) => (
      //   <Avatar.Group maxCount={3}>
      //     {list.map((uid) => {
      //       const user = userMap[uid];
      //       return (
      //         <Avatar key={uid} style={{ background: "#6C5CE7" }}>
      //           {user.initials}
      //         </Avatar>
      //       );
      //     })}
      //   </Avatar.Group>
      // ),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      width: 90,
      sorter: (a, b) => (a.views ?? 0) - (b.views ?? 0),
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: 110,
      sorter: (a, b) => (a.comments ?? 0) - (b.comments ?? 0),
    },
  ];

  return (
    <Table
      rowKey="id"
      dataSource={tasks}
      columns={columns}
      pagination={false}
      scroll={{ x: 900 }}
    />
  );
};

export default TableView;
