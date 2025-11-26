import { Button, Input, Select, Table } from "antd";
import { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import type { User } from "../../../types/user";
import { GetUsers } from "../../../api/AcessControlApi";

const columns: ColumnsType<User> = [
  {
    title: "No",
    dataIndex: "idx",
    width: 70,
    render: (_, __, index) => index + 1,
  },
  { title: "Tên", dataIndex: "fullName" },
  { title: "Email", dataIndex: "email" },
  { title: "SĐT", dataIndex: "phone" },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (v) =>
      v === "active" ? (
        <span style={{ color: "green" }}>Active</span>
      ) : (
        <span style={{ color: "red" }}>Inactive</span>
      ),
  },
  {
    title: "Action",
    render: () => <Button type="link">Detail</Button>,
  },
];

export default function Users() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { data: users = [] } = GetUsers(search, status);
  // Filter logic
  // const filteredData = useMemo(() => {
  //   return users.filter((u) => {
  //     const keyword = search.toLowerCase();

  //     const matchSearch =
  //       u.fullName.toLowerCase().includes(keyword) ||
  //       u.email.toLowerCase().includes(keyword) ||
  //       u.phone.includes(keyword);

  //     const matchStatus = status ? u.status === status : true;

  //     return matchSearch && matchStatus;
  //   });
  // }, [users, search, status]);

  return (
    <>
      <h1 style={{ marginBottom: 20 }}>Users</h1>

      {/* Filter Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Input
          placeholder="Tìm theo tên, email, SĐT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 260 }}
        />

        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 160 }}
          value={status}
          onChange={(v) => setStatus(v)}
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
      </div>

      {/* Table */}
      <Table<User> rowKey="id" columns={columns} dataSource={users} />
    </>
  );
}
