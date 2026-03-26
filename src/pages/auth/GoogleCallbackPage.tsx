import { useMeStore } from "@/store/useMeStore";
import { Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleGoogleCallback } from "@/services/auth/google";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const { setMe } = useMeStore((s) => s);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void handleGoogleCallback({ setMe, navigate }).then((res) => {
      if (res.error) setError(res.error);
    });
  }, [navigate, setMe]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Result status="error" title="Đăng nhập Google thất bại" subTitle={error} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin size="large" />
    </div>
  );
};

export default GoogleCallbackPage;

