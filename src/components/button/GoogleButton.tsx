import { Button, Image } from "antd";

interface GoogleButtonProps {
  onClick: () => void;
}

const GoogleButton = ({ onClick }: GoogleButtonProps) => {
  return (
    <Button
      block
      size="large"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "center",
        padding: "auto 12px auto",
        background: "#ffffff",
        color: "#1f1f1f",
        fontWeight: 600,
        border: "1px solid rgba(0,0,0,0.15)",
      }}
      onClick={onClick}
    >
      <Image
        preview={false}
        src="/logo/google.svg"
        alt="Google"
        width={20}
        style={{ display: "block" }}
      />
      Sign in with Google
    </Button>
  );
};

export default GoogleButton;

