import type { MeResponse } from "../auth/auth";

export const getMe = async (): Promise<MeResponse> => {
  const res = await fetch("/mock/get-me.json");
  if (!res.ok) {
    throw new Error("Failed to fetch getMe");
  }
  return res.json();
};
