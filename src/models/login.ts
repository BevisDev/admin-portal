import type { NavigateFunction } from "react-router-dom";
import type { Me } from "../types/auth/Me";

type Login = {
  from: string;
  me: Me | null;
  setMe: (data: Me) => void;
  navigate: NavigateFunction;
};
