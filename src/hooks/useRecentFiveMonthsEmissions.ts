"use client";

import { MonthlyData } from "@/types/calculate";
import browserClient from "@/utlis/supabase/browserClient";
import { useState, useEffect } from "react";

export const useRecentFiveMonthsEmissions = (
  thisYear: number,
  thisMonth: number,
  monthsToFetch: number
) => {
  const [data, setData] = useState<MonthlyData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let startMonth = thisMonth - monthsToFetch + 1;
        let startYear = thisYear;

        while (startMonth <= 0) {
          startMonth = 12 + startMonth;
          startYear--;
        }

        const targetDates = [];
        for (let i = 0; i < monthsToFetch; i++) {
          let targetMonth = startMonth + i;
          let targetYear = startYear;

          while (targetMonth > 12) {
            targetMonth = targetMonth - 12;
            targetYear++;
          }

          targetDates.push({ year: targetYear, month: targetMonth });
        }

        const { data, error } = await browserClient
          .from("carbon_records")
          .select("*")
          .or(
            targetDates
              .map((d) => `and(year.eq.${d.year},month.eq.${d.month})`)
              .join(",")
          );

        if (error) {
          throw new Error("데이터를 가져오는 중 오류가 발생했습니다.");
        }

        const groupedData = targetDates
          .map((date) => {
            const monthData = data.filter(
              (d) => d.year === date.year && d.month === date.month
            );

            if (monthData.length === 0) return null;

            const avgData: MonthlyData = {
              year: date.year,
              month: date.month,
              water_usage: Number(
                (
                  monthData.reduce((acc, cur) => acc + cur.water_usage, 0) /
                  monthData.length
                ).toFixed(2)
              ),
              water_co2: Number(
                (
                  monthData.reduce((acc, cur) => acc + cur.water_co2, 0) /
                  monthData.length
                ).toFixed(2)
              ),
              gas_usage: Number(
                (
                  monthData.reduce((acc, cur) => acc + cur.gas_usage, 0) /
                  monthData.length
                ).toFixed(2)
              ),
              gas_co2: Number(
                (
                  monthData.reduce((acc, cur) => acc + cur.gas_co2, 0) /
                  monthData.length
                ).toFixed(2)
              ),
              electricity_usage: Number(
                (
                  monthData.reduce(
                    (acc, cur) => acc + cur.electricity_usage,
                    0
                  ) / monthData.length
                ).toFixed(2)
              ),
              electricity_co2: Number(
                (
                  monthData.reduce((acc, cur) => acc + cur.electricity_co2, 0) /
                  monthData.length
                ).toFixed(2)
              ),
              waste_volume: Number(
                (
                  monthData.reduce((acc, cur) => acc + cur.waste_volume, 0) /
                  monthData.length
                ).toFixed(2)
              ),
              waste_co2: Number(
                (
                  monthData.reduce((acc, cur) => acc + cur.waste_co2, 0) /
                  monthData.length
                ).toFixed(2)
              ),
              carbon_emissions: Number(
                (
                  monthData.reduce(
                    (acc, cur) => acc + cur.carbon_emissions,
                    0
                  ) / monthData.length
                ).toFixed(2)
              ),
              car_usage: Number(
                (
                  monthData.reduce((acc, cur) => acc + cur.car_usage, 0) /
                  monthData.length
                ).toFixed(2)
              ),
              car_co2: Number(
                (
                  monthData.reduce((acc, cur) => acc + cur.car_co2, 0) /
                  monthData.length
                ).toFixed(2)
              )
            };

            return avgData;
          })
          .filter((data): data is MonthlyData => data !== null);

        setData(groupedData);
      } catch (err) {
        console.error("데이터 로딩 중 오류 발생", err);
        setError("데이터 로딩 중 오류 발생");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [thisYear, thisMonth, monthsToFetch]);

  return { data, isLoading, error };
};
