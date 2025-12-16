import type { Task } from "@/types/todo/Board";
import { Modal } from "antd";

interface ModalTask {
  task: Task;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalTask = ({ task, open, setOpen }: ModalTask) => {
  return (
    <Modal
      title="Task detail"
      open={open}
      onCancel={(prev) => setOpen(!prev)}
      footer={null}
    >
      <div>
        <h2>{task.title}</h2>

        <p style={{ color: "#666", marginBottom: 12 }}>
          {task.description || "No description"}
        </p>

        <p>Column: {task.columnId}</p>
        <p>
          <b>Due date:</b> {task.dueDate || "-"}
        </p>

        {/* <p>
          <b>Priority:</b> {task.priorityId}
        </p>

        <p>
          <b>Status:</b> {task.statusId}
        </p> */}
      </div>
    </Modal>
  );
};

export default ModalTask;
