import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Grid, Input, Modal, Select, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { usePermissionsQuery, type PermissionItem } from "@/api/access-control";

const { Text } = Typography;

interface AddPermissionForm {
  key: string;
  module: string;
  description: string;
  status: PermissionItem["status"];
}

const PermissionsPage = () => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [form] = Form.useForm<AddPermissionForm>();
  const { data } = usePermissionsQuery(search);
  const [permissionData, setPermissionData] = useState<PermissionItem[]>([]);

  useEffect(() => {
    setPermissionData(data ?? []);
  }, [data]);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return permissionData;
    return permissionData.filter(
      (item) =>
        item.key.toLowerCase().includes(keyword) ||
        item.module.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
    );
  }, [search, permissionData]);

  const handleAddPermission = async () => {
    try {
      const values = await form.validateFields();
      const newPermission: PermissionItem = {
        id: String(Date.now()),
        key: values.key,
        module: values.module,
        description: values.description,
        status: values.status,
      };
      setPermissionData((prev) => [newPermission, ...prev]);
      setOpenAddModal(false);
      form.resetFields();
    } catch {
      // Validation handled by form
    }
  };

  const columns: ColumnsType<PermissionItem> = [
    {
      title: "No",
      dataIndex: "idx",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    { title: "Permission Key", dataIndex: "key", width: 220 },
    { title: "Module", dataIndex: "module", width: 160 },
    { title: "Description", dataIndex: "description" },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (value: PermissionItem["status"]) =>
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
          placeholder="Search permission by key/module..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: isMobile ? "100%" : 320 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenAddModal(true)}
        >
          Add Permission
        </Button>
      </div>

      <Table<PermissionItem>
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        size={isMobile ? "small" : "middle"}
        scroll={{ x: 860 }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />

      <Modal
        title="Create New Permission"
        open={openAddModal}
        onCancel={() => {
          setOpenAddModal(false);
          form.resetFields();
        }}
        onOk={handleAddPermission}
        okText="Create"
        width={isMobile ? 360 : 560}
      >
        <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
          Add a new permission key for module access control.
        </Text>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            status: "active",
          }}
        >
          <Form.Item
            name="key"
            label="Permission Key"
            rules={[{ required: true, message: "Please enter permission key" }]}
          >
            <Input placeholder="e.g. reports.export" />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            <Form.Item
              name="module"
              label="Module"
              rules={[{ required: true, message: "Please enter module name" }]}
            >
              <Input placeholder="e.g. Reports" />
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
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Describe what this permission allows..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PermissionsPage;
