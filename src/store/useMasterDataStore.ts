import type { MasterData, Priority, Status } from "@/types/master_data/model";
import { create } from "zustand";

interface MasterDataStore {
  data: MasterData | null;
  priorityMap: Record<string, Priority>;
  statusMap: Record<string, Status>;
  setData: (data: MasterData) => void;
}

export const useMasterDataStore = create<MasterDataStore>((set) => ({
  data: null,
  priorityMap: {},
  statusMap: {},
  setData: (data) =>
    set({
      data,
      priorityMap: Object.fromEntries(data.priorities.map((p) => [p.id, p])),
      statusMap: Object.fromEntries(data.statuses.map((s) => [s.id, s])),
    }),
}));
