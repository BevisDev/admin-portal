import { Button, Table } from "antd";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  age: number;
}

export default function Users() {
  const [data] = useState<User[]>([
    { id: 1, name: "Bevis", age: 25 },
    { id: 2, name: "Alice", age: 30 },
  ]);

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Age", dataIndex: "age" },
    {
      title: "Action",
      render: () => <Button type="link">Detail</Button>,
    },
  ];

  return (
    <>
      <h1 style={{ marginBottom: 20 }}>Users</h1>
      <Table<User> rowKey="id" columns={columns} dataSource={data} />
    </>
  );
}
