export const SysConfig = {
  beUrl: import.meta.env.VITE_BE_URL,
  timeout: Number(import.meta.env.VITE_TIMEOUT),
  profile: import.meta.env.VITE_PROFILE,
};

export interface AppConfig {
  version: string;
}
