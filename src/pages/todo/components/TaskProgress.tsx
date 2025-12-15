import { ProgressColor } from "@/styles/progress";
import { TagColor } from "@/styles/tag";
import { Progress, Tag } from "antd";

interface TaskProgressProps {
  percent: number;
}

const TaskProgress = ({ percent }: TaskProgressProps) => {
  let tagColor: string = TagColor.zero;
  let progressColor: string = ProgressColor.zero;
  if (percent > 0 && percent < 65) {
    tagColor = TagColor.low;
    progressColor = ProgressColor.low;
  } else if (percent >= 65 && percent < 99) {
    tagColor = TagColor.mid;
    progressColor = ProgressColor.mid;
  } else if (percent === 100) {
    tagColor = TagColor.done;
    progressColor = ProgressColor.done;
  } else if (percent > 100) {
    tagColor = "red";
    progressColor = ProgressColor.over;
  }

  return (
    <Tag
      color={tagColor}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 20,
        padding: "2px 8px",
      }}
    >
      <Progress
        type="circle"
        percent={percent}
        size={18}
        strokeWidth={10}
        showInfo={false}
        strokeColor={progressColor}
        trailColor="#eee"
      />

      <span style={{ fontSize: 12, fontWeight: 600 }}>{percent}%</span>
    </Tag>
  );
};

export default TaskProgress;
