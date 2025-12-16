import { Button, DatePicker, Form, Input, Modal } from "antd";

interface ModalAddTaskProps {
  colId: number;
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  //   onCreate: () => void;
}

const ModalAddTask = ({ open, onClose }: ModalAddTaskProps) => {
  return (
    <Modal
      title="Create Task"
      open={open}
      onCancel={(prev) => onClose(!prev)}
      footer={null}
    >
      <Form
        layout="vertical"
        // onFinish={(values) => {
        //   const newTask = {
        //     id: Date.now(),
        //     title: values.title,
        //     description: values.description,
        //     dueDate: values.dueDate?.format("YYYY-MM-DD"),
        //     progress: 0,
        //     columnId: 1, // hoặc cột default bạn muốn
        //   };

        // //   setTasks((prev) => [...prev, newTask]);
        // //   setOpenCreateModal(false);
        // }}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input placeholder="Task title..." />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Task description..." />
        </Form.Item>

        <Form.Item label="Due Date" name="dueDate">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ background: "#111" }}
        >
          Create Task
        </Button>
      </Form>
    </Modal>
  );
};

export default ModalAddTask;
