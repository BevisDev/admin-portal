import type { AppConfig, PriorityConfig, StatusConfig } from "@/config/Config";
import { create } from "zustand";

interface ConfigState {
  appConfig: AppConfig | null;
  priorityMap: Record<number, PriorityConfig>;
  statusMap: Record<number, StatusConfig>;
  setAppConfig: (cf: AppConfig) => void;
}

export const getConfigStore = create<ConfigState>((set) => ({
  appConfig: null,
  priorityMap: {},
  statusMap: {},
  setAppConfig: (cf) =>
    set({
      appConfig: cf,
      priorityMap: Object.fromEntries(cf.priorities.map((p) => [p.id, p])),
      statusMap: Object.fromEntries(cf.statuses.map((s) => [s.id, s])),
    }),
}));
