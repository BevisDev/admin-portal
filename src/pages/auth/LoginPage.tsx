import MSButton from "@/components/button/MSButton";
import { useMeStore } from "@/store/useMeStore";
import { Card, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import bgLogin from "@/assets/background/bg-login.jpg";

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  // const [loading, setLoading] = useState(false);
  const { me, setMe } = useMeStore((s) => s);

  const handleClick = () => {
    if (!me) return;
    setMe({
      ...me,
      isAuthenticated: true,
    });
    navigate(from, { replace: true });
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

          <MSButton onClick={handleClick} />
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
