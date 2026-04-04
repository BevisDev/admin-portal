import { useQuery } from "@tanstack/react-query";
import { goldPriceService } from "@/services/gold-price";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const useGoldPriceQuery = () => {
  return useQuery({
    queryKey: ["gold-price"],
    queryFn: () => goldPriceService.getGoldPrice(),
    staleTime: ONE_DAY_MS,
  });
};
