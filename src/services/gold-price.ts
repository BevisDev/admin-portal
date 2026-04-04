import { API } from "@/api";
import { GETQuery } from "@/hooks/useFetchQuery";
import type { Response } from "@/types/response";

export interface GoldPriceItem {
  typeCode: string;
  label: string;
  buy: number;
  sell: number;
  updatedAt: string;
}

export interface GoldPriceData {
  updatedAt: string;
  source: "vang-today" | "mock";
  items: GoldPriceItem[];
}

interface GoldPriceMockData {
  updatedAt: string;
  items: GoldPriceItem[];
  source?: string;
}

interface VangTodayItem {
  type_code: string;
  buy: number;
  sell: number;
  update_time: number;
}

interface VangTodayResponse {
  success: boolean;
  current_time: number;
  data: VangTodayItem[];
}

const GOLD_LABEL_MAP: Record<string, string> = {
  SJL1L10: "SJC 9999",
  SJ9999: "Nhan SJC 9999",
  DOHNL: "DOJI Ha Noi",
  DOHCML: "DOJI HCM",
  BTSJC: "Bao Tin SJC",
};

const toLabel = (typeCode: string) => GOLD_LABEL_MAP[typeCode] || typeCode;

const normalizeVangTodayItems = (items: VangTodayItem[]): GoldPriceItem[] => {
  return items.map((item) => ({
    typeCode: item.type_code,
    label: toLabel(item.type_code),
    buy: item.buy,
    sell: item.sell,
    updatedAt: new Date(item.update_time * 1000).toISOString(),
  }));
};

const pickFeaturedItems = (items: GoldPriceItem[]): GoldPriceItem[] => {
  const preferred = ["SJL1L10", "SJ9999", "DOHNL"];
  const fromPreferred = preferred
    .map((code) => items.find((item) => item.typeCode === code))
    .filter((item): item is GoldPriceItem => Boolean(item));

  if (fromPreferred.length > 0) return fromPreferred;
  return items.slice(0, 5);
};

const getLatestUpdatedAt = (items: GoldPriceItem[]): string => {
  if (items.length === 0) return new Date().toISOString();
  const latest = items
    .map((item) => new Date(item.updatedAt).getTime())
    .filter((time) => Number.isFinite(time))
    .sort((a, b) => b - a)[0];
  return new Date(latest).toISOString();
};

export const goldPriceService = {
  async getGoldPrice(): Promise<GoldPriceData> {
    try {
      const res = await fetch("https://www.vang.today/api/prices", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`Gold API failed with status ${res.status}`);
      }

      const payload = (await res.json()) as VangTodayResponse;
      if (!payload.success || !Array.isArray(payload.data)) {
        throw new Error("Invalid gold API payload");
      }

      const normalized = normalizeVangTodayItems(payload.data);
      const featured = pickFeaturedItems(normalized);

      return {
        updatedAt: getLatestUpdatedAt(featured),
        source: "vang-today",
        items: featured,
      };
    } catch {
      const mockRes = await GETQuery<null, Response<GoldPriceMockData>>({
        url: API.goldPrice,
      });

      return {
        updatedAt: mockRes.data.updatedAt,
        source: "mock",
        items: mockRes.data.items,
      };
    }
  },
};
