import { useMeStore } from "@/store/useMeStore";
import { Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const { setMe } = useMeStore((s) => s);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    console.log("hello");
  }, [navigate, setMe]);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Result status="error" title="Google sign-in failed" subTitle={error} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default GoogleCallbackPage;
