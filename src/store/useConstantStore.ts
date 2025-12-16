import type { Constant, Priority, Status } from "@/types/constants/constant";
import { create } from "zustand";

interface ConstStore {
  data: Constant | null;
  priorityMap: Record<string, Priority>;
  statusMap: Record<string, Status>;
  setData: (data: Constant) => void;
}

export const useConstantStore = create<ConstStore>((set) => ({
  data: null,
  priorityMap: {},
  statusMap: {},
  setData: (data) =>
    set({
      data: data,
      priorityMap: Object.fromEntries(data.priorities.map((p) => [p.id, p])),
      statusMap: Object.fromEntries(data.statuses.map((s) => [s.id, s])),
    }),
}));
