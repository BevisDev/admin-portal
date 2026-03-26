declare const APP_VERSION: string;

export const SysConfig = {
  beUrl: import.meta.env.VITE_BE_URL,
  timeout: Number(import.meta.env.VITE_TIMEOUT),
  profile: import.meta.env.VITE_PROFILE,
  appVersion: APP_VERSION,
  googleOauthUrl: import.meta.env.VITE_GOOGLE_OAUTH_URL,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  googleRedirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
};
