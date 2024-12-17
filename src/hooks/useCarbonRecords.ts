import { getUser } from "@/api/auth-actions";
import { fetchCarbonRecords } from "@/api/fetchCarbonRecordsApi";
import { useQuery } from "@tanstack/react-query";

type UseCarbonRecordsProps = {
  selectedYear: number | null;
};

export const useCarbonRecords = ({ selectedYear }: UseCarbonRecordsProps) => {
  return useQuery({
    queryKey: ["carbonRecords", selectedYear],
    queryFn: async () => {
      const user = await getUser();
      if (!user) return { records: null, avgEmission: 0 };

      const records = await fetchCarbonRecords(user.id, selectedYear);
      if (!records || records.length === 0)
        return { records: [], avgEmission: 0 };

      const totalEmission = records.reduce(
        (sum, record) => sum + (record.carbon_emissions || 0),
        0
      );
      const avgEmission = totalEmission / records.length;

      return { records, avgEmission };
    }
    // staleTime: 5 * 60 * 1000, // 데이터 갱신 주기
    // cacheTime: 10 * 60 * 1000 // 캐시 유지 시간
  });
};
