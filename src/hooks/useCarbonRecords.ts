// src/hooks/useCarbonRecords.ts
import { getUser } from "@/api/auth-actions";
import { fetchCarbonRecords } from "@/api/fetchCarbonRecordsApi";
import { MonthlyData } from "@/types/calculate";
import { useState, useEffect } from "react";

type UseCarbonRecordsProps = {
  selectedYear: number | null;
};

export const useCarbonRecords = ({ selectedYear }: UseCarbonRecordsProps) => {
  const [myAllData, setMyAllData] = useState<MonthlyData[] | null>(null);
  const [myAllAvgData, setMyAllAvgData] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true); // 데이터 로드 시작
      try {
        const user = await getUser();
        if (!user) {
          setMyAllData(null);
          setMyAllAvgData(0);
          setIsLoading(false); // 데이터 로드 완료
          return;
        }

        const records = await fetchCarbonRecords(user.id, selectedYear);

        setMyAllData(records);

        if (records && records.length > 0) {
          const totalEmission = records.reduce(
            (sum, record) => sum + (record.carbon_emissions || 0),
            0
          );
          const avgEmission = totalEmission / records.length;
          setMyAllAvgData(avgEmission);
        } else {
          setMyAllAvgData(0);
        }
      } catch (error) {
        console.error("Error loading carbon records:", error);
        setMyAllData(null);
        setMyAllAvgData(0);
      } finally {
        setIsLoading(false); // 데이터 로드 완료
      }
    };

    loadData();
  }, [selectedYear]);

  return { myAllData, myAllAvgData, isLoading };
};
