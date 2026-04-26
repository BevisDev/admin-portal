import type { NavigateFunction } from "react-router-dom";
import { loginGoogle } from "./google_login";
import type { Me } from "@/models/auth/me";

export type LoginProvider =
  | "password"
  | "google"
  | "facebook"
  | "apple"
  | "github";

type LoginRequest = {
  from: string;
  provider: LoginProvider;
  me: Me | null;
  setMe: (data: Me) => void;
  navigate: NavigateFunction;
};

type LoginResponse = {
  me: Me | null;
  error?: string;
};

export const checkExistsUsername = (
  username: string,
): {
  exists: boolean;
  error?: string;
} => {
  if (!username.trim()) {
    return {
      exists: false,
      error: "Vui lòng nhập username.",
    };
  }

  try {
    return {
      exists: false,
    };
  } catch {
    return {
      exists: false,
      error: "error",
    };
  }
};

export const login = (r: LoginRequest): LoginResponse => {
  switch (r.provider) {
    case "password": {
      if (!r.me) {
        return {
          me: null,
          error: "Login session is not ready. Please try again.",
        };
      }
      return {
        me: r.me,
      };
    }

    case "google": {
      const err = loginGoogle();
      return {
        me: null,
        error: err,
      };
    }

    default:
      return {
        me: null,
        error: `unknow login with provider: ${r.provider}`,
      };
  }

  // if (!clientId || !redirectUri) {
  //   r.setMe({
  //     ...r.me,
  //     isAuthenticated: true,
  //   });
  //   r.navigate(from, { replace: true });
  //   message.info("Google OAuth is not configured. Using demo login.");
  //   return { mode: "demo" };
  // }

  // // Save where to return after OAuth.
  // if (typeof window !== "undefined") {
  //   window.sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, from);
  // }

  // const state =
  //   typeof crypto !== "undefined" && "randomUUID" in crypto
  //     ? crypto.randomUUID()
  //     : String(Date.now());

  // const scope = "openid email profile";

  // const authUrl =
  //   SysConfig.googleOauthUrl +
  //   `?client_id=${encodeURIComponent(clientId)}` +
  //   `&redirect_uri=${encodeURIComponent(redirectUri)}` +
  //   `&response_type=code` +
  //   `&scope=${encodeURIComponent(scope)}` +
  //   `&state=${encodeURIComponent(state)}` +
  //   `&access_type=offline` +
  //   `&prompt=consent`;

  // window.location.assign(authUrl);
  // return { mode: "oauth" };
};

// export const handleGoogleCallback = async ({
//   setMe,
//   navigate,
// }: HandleGoogleCallbackArgs): Promise<{ error?: string }> => {
//   const params = new URLSearchParams(window.location.search);
//   const code = params.get("code");
//   const oauthError = params.get("error");
//   const oauthErrorDesc = params.get("error_description");

//   if (oauthError) {
//     return { error: oauthErrorDesc || oauthError };
//   }

//   if (!code) {
//     return { error: "Missing Google login authorization code." };
//   }

//   try {
//     // Demo only: we don't exchange code with backend yet.
//     // We load mock "me" + mock google profile and map to user info.
//     const [meRes, googleRes] = await Promise.all([
//       GETQuery<null, Response<Me>>({ url: API.me }),
//       GETQuery<null, Response<GoogleProfile>>({ url: API.googleCallback }),
//     ]);
//     const google = googleRes.data;

//     setMe({
//       ...meRes.data,
//       info: {
//         ...meRes.data.info,
//         fullName: google.name || meRes.data.info.fullName,
//         email: google.email || meRes.data.info.email,
//         avatarUrl: google.picture || meRes.data.info.avatarUrl,
//       },
//       isAuthenticated: true,
//     });

//     const to = window.sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY) || "/";
//     window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
//     navigate(to, { replace: true });
//     return {};
//   } catch {
//     return { error: "Unable to complete sign-in. Please try again." };
//   }
// };
