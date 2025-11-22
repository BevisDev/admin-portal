export interface MeResponse {
  user: {
    id: number;
    email: string;
    name?: string;
  } | null;
  roles: string[];
  permissions: string[];
}

export const getMe = async (): Promise<MeResponse> => {
  const res = await fetch("/auth/me");
  if (!res.ok) {
    throw new Error("Failed to fetch getMe");
  }
  return res.json();
};
