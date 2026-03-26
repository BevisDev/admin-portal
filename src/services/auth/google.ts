import { API } from "@/api";
import { SysConfig } from "@/config/SysConfig";
import { GETQuery } from "@/hooks/useFetchQuery";
import type { Me } from "@/types/auth/Me";
import type { Response } from "@/types/response";
import { message } from "antd";
import type { NavigateFunction } from "react-router-dom";

const POST_LOGIN_REDIRECT_KEY = "admin-portal:post-login-redirect";


type HandleGoogleCallbackArgs = {
  setMe: (data: Me) => void;
  navigate: NavigateFunction;
};

export const login = ({
  from,
  me,
  setMe,
  navigate,
}: StartGoogleLoginArgs): {
  mode: "oauth" | "demo" | "error";
  error?: string;
} => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI as
    | string
    | undefined;

  // If env not configured yet, fallback to demo login (mock "me").
  if (!clientId || !redirectUri) {
    if (!me) {
      return {
        mode: "error",
        error: "Phiên đăng nhập chưa sẵn sàng. Vui lòng thử lại.",
      };
    }

    setMe({
      ...me,
      isAuthenticated: true,
    });
    navigate(from, { replace: true });
    message.info("Chưa cấu hình Google OAuth. Đang dùng đăng nhập demo.");
    return { mode: "demo" };
  }

  // Save where to return after OAuth.
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, from);
  }

  const state =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now());

  const scope = "openid email profile";

  const authUrl =
    SysConfig.googleOauthUrl +
    `?client_id=${encodeURIComponent(SysConfig.googleClientId)}` +
    `&redirect_uri=${encodeURIComponent(SysConfig.googleRedirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}` +
    `&access_type=offline` +
    `&prompt=consent`;

  window.location.assign(authUrl);
  return { mode: "oauth" };
};

export const handleGoogleCallback = async ({
  setMe,
  navigate,
}: HandleGoogleCallbackArgs): Promise<{ error?: string }> => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const oauthError = params.get("error");
  const oauthErrorDesc = params.get("error_description");

  if (oauthError) {
    return { error: oauthErrorDesc || oauthError };
  }

  if (!code) {
    return { error: "Không nhận được mã đăng nhập (code) từ Google." };
  }

  try {
    // Demo only: we don't exchange code with backend yet.
    // We load mock "me" and mark authenticated to unlock protected routes.
    const res = await GETQuery<null, Response<Me>>({ url: API.me });
    setMe({
      ...res.data,
      isAuthenticated: true,
    });

    const to = window.sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY) || "/";
    window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
    navigate(to, { replace: true });
    return {};
  } catch {
    return { error: "Không thể hoàn tất đăng nhập. Vui lòng thử lại." };
  }
};
