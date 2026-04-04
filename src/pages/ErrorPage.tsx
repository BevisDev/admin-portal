import { Result } from "antd";
import type { ExceptionStatusType } from "antd/es/result";

const ErrorPage = (
  status: ExceptionStatusType = 500,
  title: string = "System error",
  subTitle: string = "Please try again in a few minutes"
) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Result status={status} title={title} subTitle={subTitle} />
    </div>
  );
};

export default ErrorPage;
