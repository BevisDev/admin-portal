import { userStore } from "@/store/UserStore";
import { useEffect } from "react";
import { GetMe } from "./GetMe";

export const useAuth = () => {
  const { me, setAuth, logout } = userStore((s) => s);
  const { data, error, isLoading } = GetMe();

  useEffect(() => {
    if (data) {
      setAuth(data);
    }
  }, [data, setAuth]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  return {
    me,
    loading: isLoading,
  };
};
