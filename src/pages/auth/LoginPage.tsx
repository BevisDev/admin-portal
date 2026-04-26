import { useMeStore } from "@/store/useMeStore";
import { useCheckAccountMutation } from "@/api/auth";
import {
  ArrowRightOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { gsap } from "gsap";
import { Button, Card, Divider, Input, Typography, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bgLogin from "@/assets/background/bg-login.jpg";
import {
  checkExistsUsername,
  login,
  type LoginProvider,
} from "@/services/auth/login";
import LoginProviders from "./LoginProviders";

const { Title } = Typography;
interface LoginLocationState {
  from?: string;
}
type State = "idle" | "loading" | "ok" | "exists" | "error";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LoginLocationState | null;
  const from =
    typeof locationState?.from === "string" ? locationState.from : "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<State>("idle");
  const passwordWrapRef = useRef<HTMLDivElement | null>(null);
  const checkAccountMutation = useCheckAccountMutation();
  const { me, setMe } = useMeStore((s) => s);

  const handleLogin = (provider: LoginProvider) => {
    const res = login({
      from,
      provider,
      me,
      setMe,
      navigate,
    });
    if (res.error) {
      message.error(res.error);
    }
    if (!res.me) {
      message.error("không tìm thấy user");
      return;
    }

    setMe({
      ...res.me,
      isAuthenticated: true,
    });
    void navigate(from, { replace: true });
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
      },
    );
  }, [showPassword]);

  const handleExistsUsername = () => {
    setState("loading");
    const res = checkExistsUsername(username);
    if (res.error) {
      setState("error");
      setShowPassword(false);
      setPassword("");
    }

    if (res.exists) {
      setState("exists");
      setShowPassword(false);
      setPassword("");
      return;
    }

    setPassword("");
    setState("ok");
    setShowPassword(true);
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
            onPressEnter={handleExistsUsername}
            suffix={
              state === "idle" ? (
                <Button
                  type="text"
                  shape="circle"
                  aria-label="Next"
                  icon={<ArrowRightOutlined style={{ color: "#fff" }} />}
                  onClick={handleExistsUsername}
                  style={{
                    background: "#111",
                    width: 28,
                    height: 28,
                    minWidth: 28,
                  }}
                />
              ) : state === "loading" ? (
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
              ) : state === "ok" ? (
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
                onPressEnter={() => {
                  void handleLogin("password");
                }}
              />
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  void handleLogin;
                }}
              >
                Đăng nhập
              </Button>
            </div>
          </div>

          <Divider plain style={{ margin: "8px 0" }}>
            or
          </Divider>

          {/* Login with */}
          <LoginProviders />
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
