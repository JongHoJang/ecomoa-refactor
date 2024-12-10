import { useQuery } from "@tanstack/react-query";
import { MonthlyData } from "@/types/calculate";
import {
  fetchMyCarbonData,
  fetchUserCarbonData
} from "@/utlis/callculator/fetchCarbonData";

export const useMyCarbonData = (thisYear: number, thisMonth: number) => {
  return useQuery<MonthlyData | null>({
    queryKey: ["carbonData", thisYear, thisMonth],
    queryFn: () => fetchMyCarbonData(thisYear, thisMonth),
    staleTime: 5 * 60 * 1000
  });
};

export const useUserCarbonData = (thisYear: number, thisMonth: number) => {
  return useQuery<MonthlyData | null>({
    queryKey: ["totalAvgData", thisYear, thisMonth],
    queryFn: () => fetchUserCarbonData(thisYear, thisMonth),
    staleTime: 5 * 60 * 1000
  });
};
