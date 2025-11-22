import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/AuthApi";
import { userStore } from "../store/UserStore";

const useAuth = () => {
  const setAuth = userStore((state) => state.setAuth);
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
};

export default useAuth;
