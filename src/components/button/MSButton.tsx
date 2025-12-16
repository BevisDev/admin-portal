import { Button, Image } from "antd";

interface MSButtonProps {
  onClick: () => void;
}

const MSButton = ({ onClick }: MSButtonProps) => {
  return (
    <Button
      size="large"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "center",
        padding: "auto 12px auto",
        background: "#2f2f2f",
        color: "#fff",
        fontWeight: 600,
      }}
      onClick={onClick}
    >
      <Image preview={false} src="/logo/ms.svg" alt="Microsoft" />
      Đăng nhập với Microsoft
    </Button>
  );
};

export default MSButton;
