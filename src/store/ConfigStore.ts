import type { AppConfig } from "@/config/Config";
import { create } from "zustand";

interface ConfigState {
  appConfig: AppConfig | null;
  setAppConfig: (cf: AppConfig | null) => void;
}

export const configStore = create<ConfigState>((set) => ({
  appConfig: null,
  setAppConfig: (cf) => set({ appConfig: cf }),
}));
