import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Grid, Input, InputNumber, Modal, Select, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { useRolesQuery, type RoleItem } from "@/api/access-control";

const { Text } = Typography;

interface AddRoleForm {
  name: string;
  description: string;
  permissionsCount: number;
  status: RoleItem["status"];
}

const RolesPage = () => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [form] = Form.useForm<AddRoleForm>();
  const { data } = useRolesQuery(search);
  const [roleData, setRoleData] = useState<RoleItem[]>([]);

  useEffect(() => {
    setRoleData(data ?? []);
  }, [data]);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return roleData;
    return roleData.filter(
      (role) =>
        role.name.toLowerCase().includes(keyword) ||
        role.description.toLowerCase().includes(keyword)
    );
  }, [search, roleData]);

  const handleAddRole = async () => {
    try {
      const values = await form.validateFields();
      const newRole: RoleItem = {
        id: String(Date.now()),
        name: values.name,
        description: values.description,
        usersCount: 0,
        permissionsCount: values.permissionsCount,
        status: values.status,
      };
      setRoleData((prev) => [newRole, ...prev]);
      setOpenAddModal(false);
      form.resetFields();
    } catch {
      // Validation handled by form
    }
  };

  const columns: ColumnsType<RoleItem> = [
    {
      title: "No",
      dataIndex: "idx",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    { title: "Role", dataIndex: "name" },
    { title: "Description", dataIndex: "description" },
    { title: "Users", dataIndex: "usersCount", width: 110 },
    { title: "Permissions", dataIndex: "permissionsCount", width: 130 },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (value: RoleItem["status"]) =>
        value === "active" ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Action",
      width: 120,
      render: () => <Button type="link">Detail</Button>,
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search role by name/description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: isMobile ? "100%" : 320 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenAddModal(true)}>
          Add Role
        </Button>
      </div>

      <Table<RoleItem>
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        size={isMobile ? "small" : "middle"}
        scroll={{ x: 760 }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />

      <Modal
        title="Create New Role"
        open={openAddModal}
        onCancel={() => {
          setOpenAddModal(false);
          form.resetFields();
        }}
        onOk={handleAddRole}
        okText="Create"
        width={isMobile ? 360 : 560}
      >
        <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
          Define role information and assign initial permission count.
        </Text>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            status: "active",
            permissionsCount: 1,
          }}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input placeholder="e.g. Team Lead" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Role scope and responsibilities..." />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            <Form.Item
              name="permissionsCount"
              label="Permissions Count"
              rules={[{ required: true, message: "Please enter permissions count" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default RolesPage;
