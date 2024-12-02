import {
  loadMyRecentFiveMonthsEmissions,
  loadRecentFiveMonthsEmissions
} from "@/hooks/monthlyData";
import { MonthlyData } from "@/types/calculate";
import React, { useEffect, useState } from "react";
import MonthlyChartMain from "./MonthlyChartMain";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const CompareMonthlyEmissions = () => {
  const [emissionsData, setEmissionsData] = useState<MonthlyData[] | null>(
    null
  );
  const [currentData, setCurrentData] = useState<MonthlyData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadRecentFiveMonthsEmissions(
        currentYear,
        currentMonth,
        5
      );
      setEmissionsData(data);
    };

    const fetchMyData = async () => {
      const data = await loadMyRecentFiveMonthsEmissions(
        currentYear,
        currentMonth,
        5
      );
      setCurrentData(data);
    };
    fetchData();
    fetchMyData();
  }, []);

  return (
    <>
      <div className="flex flex-col">
        {/* 차트 부분 */}
        <div className="relative w-[1000px] h-[300px] z-0 mt-[68px]">
          <MonthlyChartMain
            emissionsData={emissionsData}
            currentData={currentData}
          />
          <div className="w-[200px] h-[300px] bg-[#ff7d6f33] rounded-[12px] right-0 top-[-20px] absolute z-[-10]" />
        </div>
      </div>
    </>
  );
};

export default CompareMonthlyEmissions;
