import GoogleButton from "@/components/button/GoogleButton";
import { useMeStore } from "@/store/useMeStore";
import { useCheckAccountMutation } from "@/api/auth";
import { ArrowRightOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { gsap } from "gsap";
import {
  Button,
  Card,
  Divider,
  Input,
  Typography,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bgLogin from "@/assets/background/bg-login.jpg";
import { login } from "@/services/auth/google";

const { Title } = Typography;
interface LoginLocationState {
  from?: string;
}
type CheckState = "idle" | "loading" | "ok" | "exists" | "error";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LoginLocationState | null;
  const from = typeof locationState?.from === "string" ? locationState.from : "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const passwordWrapRef = useRef<HTMLDivElement | null>(null);
  const checkAccountMutation = useCheckAccountMutation();
  const { me, setMe } = useMeStore((s) => s);

  const handleGoogleLogin = () => {
    const res = login({ from, me, setMe, navigate });
    if (res.mode === "error" && res.error) {
      message.error(res.error);
    }
  };

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
    if (!username.trim()) {
      message.error("Vui lòng nhập username.");
      return;
    }

    try {
      setCheckState("loading");
      const isAccountExist = await checkAccountMutation.mutateAsync({
        username,
      });

      // Theo yêu cầu: nếu account đã tồn tại thì báo lỗi và không cho đi tiếp
      if (isAccountExist) {
        setCheckState("exists");
        setShowPassword(false);
        setPassword("");
        return;
      }

      setPassword("");
      setCheckState("ok");
      setShowPassword(true);
    } catch {
      setCheckState("error");
      setShowPassword(false);
      setPassword("");
    }
  };

  const handleLogin = () => {
    if (!me) return;
    if (!password.trim()) {
      message.error("Vui lòng nhập mật khẩu.");
      return;
    }

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
            Sign In
          </Title>

          <Input
            size="large"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={() => {
              void handleNext();
            }}
            suffix={
              checkState === "idle" ? (
                <Button
                  type="text"
                  shape="circle"
                  aria-label="Next"
                  icon={<ArrowRightOutlined style={{ color: "#fff" }} />}
                  onClick={() => {
                    void handleNext();
                  }}
                  style={{
                    background: "#111",
                    width: 28,
                    height: 28,
                    minWidth: 28,
                  }}
                />
              ) : checkState === "loading" ? (
                <Button
                  type="text"
                  shape="circle"
                  aria-label="Checking"
                  icon={<ArrowRightOutlined style={{ color: "#fff" }} />}
                  loading={checkAccountMutation.isPending}
                  disabled
                  style={{
                    background: "#111",
                    width: 28,
                    height: 28,
                    minWidth: 28,
                  }}
                />
              ) : checkState === "ok" ? (
                <CheckOutlined style={{ color: "#18a058", fontSize: 18 }} />
              ) : (
                <CloseOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />
              )
            }
          />

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

          <Divider plain style={{ margin: "8px 0" }}>
            or
          </Divider>

          <GoogleButton onClick={handleGoogleLogin} />
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
