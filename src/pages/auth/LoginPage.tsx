import MSButton from "@/components/button/MSButton";
import { useMeStore } from "@/store/useMeStore";
import { Card, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

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
      }}
    >
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Đăng nhập
        </Title>

        <MSButton onClick={handleClick} />
      </Card>
    </div>
  );
};

export default LoginPage;
