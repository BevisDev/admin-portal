import { useCheckAccountMutation } from "@/api/auth";
import { useMeStore } from "@/store/useMeStore";
import { ArrowRightOutlined, GoogleOutlined } from "@ant-design/icons";
import { gsap } from "gsap";
import { Alert, Button, Card, Input, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bgLogin from "@/assets/background/bg-login.jpg";

const { Title } = Typography;
interface LoginLocationState {
  from?: string;
}
type FeedbackType = "error" | "success";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LoginLocationState | null;
  const from = typeof locationState?.from === "string" ? locationState.from : "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: FeedbackType;
    message: string;
  } | null>(null);
  const passwordWrapRef = useRef<HTMLDivElement | null>(null);
  const checkAccountMutation = useCheckAccountMutation();
  const { me, setMe } = useMeStore((s) => s);

  useEffect(() => {
    if (!showPassword || !passwordWrapRef.current) return;

    gsap.fromTo(
      passwordWrapRef.current,
      {
        autoAlpha: 0,
        y: -10,
        height: 0,
      },
      {
        autoAlpha: 1,
        y: 0,
        height: "auto",
        duration: 0.32,
        ease: "power2.out",
      }
    );
  }, [showPassword]);

  const handleNext = async () => {
    setFeedback(null);
    if (!username.trim()) {
      setFeedback({ type: "error", message: "Vui lòng nhập username." });
      return;
    }

    try {
      const isAccountExist = await checkAccountMutation.mutateAsync({
        username,
      });

      // Theo yêu cầu: nếu account đã tồn tại thì báo lỗi và không cho đi tiếp
      if (isAccountExist) {
        setShowPassword(false);
        setPassword("");
        setFeedback({ type: "error", message: "Account đã tồn tại." });
        return;
      }

      setPassword("");
      setFeedback({ type: "success", message: "Username hợp lệ." });
      setShowPassword(true);
    } catch {
      setFeedback({
        type: "error",
        message: "Không thể kiểm tra account. Vui lòng thử lại.",
      });
    }
  };

  const handleLogin = () => {
    if (!me) return;
    if (!password.trim()) {
      setFeedback({ type: "error", message: "Vui lòng nhập mật khẩu." });
      return;
    }

    setMe({
      ...me,
      isAuthenticated: true,
    });
    void navigate(from, { replace: true });
  };

  const handleLoginWithGoogle = () => {
    if (!me) return;
    // TODO: thay bằng OAuth thật khi backend/redirect url được cấu hình
    setMe({
      ...me,
      isAuthenticated: true,
    });
    void navigate(from, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url(${bgLogin})`,
      }}
    >
      <Card
        style={{
          width: 360,
          borderRadius: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            Đăng nhập
          </Title>

          <Button
            block
            size="large"
            icon={<GoogleOutlined />}
            onClick={handleLoginWithGoogle}
            style={{ background: "#111", color: "#fff", borderColor: "#111" }}
          >
            Login với Google
          </Button>

          <Input
            size="large"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={() => {
              void handleNext();
            }}
            suffix={
              <Button
                type="text"
                shape="circle"
                aria-label="Next"
                icon={<ArrowRightOutlined style={{ color: "#fff" }} />}
                onClick={() => {
                  void handleNext();
                }}
                loading={checkAccountMutation.isPending}
                style={{
                  background: "#111",
                  width: 28,
                  height: 28,
                  minWidth: 28,
                }}
              />
            }
          />

          {feedback ? (
            <Alert type={feedback.type} message={feedback.message} showIcon />
          ) : null}

          <div
            ref={passwordWrapRef}
            style={{
              display: showPassword ? "block" : "none",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Input.Password
                size="large"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPressEnter={handleLogin}
              />
              <Button type="primary" size="large" onClick={handleLogin}>
                Đăng nhập
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
