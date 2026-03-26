import { API } from "@/api";
import { SysConfig } from "@/config/SysConfig";
import { GETQuery } from "@/hooks/useFetchQuery";
import type { Me } from "@/types/auth/Me";
import type { Response } from "@/types/response";
import { message } from "antd";
import type { NavigateFunction } from "react-router-dom";

const POST_LOGIN_REDIRECT_KEY = "admin-portal:post-login-redirect";


type LoginArgs = {
  from: string;
  me: Me | null;
  setMe: (data: Me) => void;
  navigate: NavigateFunction;
};

type HandleGoogleCallbackArgs = {
  setMe: (data: Me) => void;
  navigate: NavigateFunction;
};

type GoogleProfile = {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  verified_email?: boolean;
};

export const login = ({
  from,
  me,
  setMe,
  navigate,
}: LoginArgs): {
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
        error: "Login session is not ready. Please try again.",
      };
    }

    setMe({
      ...me,
      isAuthenticated: true,
    });
    navigate(from, { replace: true });
    message.info("Google OAuth is not configured. Using demo login.");
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
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
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
    return { error: "Missing Google login authorization code." };
  }

  try {
    // Demo only: we don't exchange code with backend yet.
    // We load mock "me" + mock google profile and map to user info.
    const [meRes, googleRes] = await Promise.all([
      GETQuery<null, Response<Me>>({ url: API.me }),
      GETQuery<null, Response<GoogleProfile>>({ url: API.googleCallback }),
    ]);
    const google = googleRes.data;

    setMe({
      ...meRes.data,
      info: {
        ...meRes.data.info,
        fullName: google.name || meRes.data.info.fullName,
        email: google.email || meRes.data.info.email,
        avatarUrl: google.picture || meRes.data.info.avatarUrl,
      },
      isAuthenticated: true,
    });

    const to = window.sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY) || "/";
    window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
    navigate(to, { replace: true });
    return {};
  } catch {
    return { error: "Unable to complete sign-in. Please try again." };
  }
};
