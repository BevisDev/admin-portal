import type { AppConfig } from "@/config/AppConfig";
import { create } from "zustand";

interface AppStore {
  appConfig: AppConfig | null;
  setAppConfig: (cf: AppConfig) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  appConfig: null,
  setAppConfig: (cf) =>
    set({
      appConfig: cf,
    }),
}));
