import { getUserStore } from "@/store/UserStore";
import { useEffect } from "react";
import { GetMe } from "./GetMe";

export const useAuth = () => {
  const { data, error, isLoading } = GetMe();
  const { me, setAuth, logout } = getUserStore((s) => s);

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
