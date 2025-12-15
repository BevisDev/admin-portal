export const SysConfig = {
  beUrl: import.meta.env.VITE_BE_URL,
  timeout: Number(import.meta.env.VITE_TIMEOUT),
  profile: import.meta.env.VITE_PROFILE,
};

export interface AppConfig {
  version: string;
  priorities: PriorityConfig[];
  statuses: StatusConfig[];
}

export interface PriorityConfig {
  id: number;
  label: string;
  color: string;
}

export interface StatusConfig {
  id: number;
  label: string;
  color: string;
}
