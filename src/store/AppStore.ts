import { create } from "zustand";
import type { AppConfig } from "../config/AppConfig";

interface AppStore {
  appConfig: AppConfig | null;
  setAppConfig: (cf: AppConfig | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  appConfig: null,
  setAppConfig: (cf) => set({ appConfig: cf }),
}));
