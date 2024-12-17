import { useState, useEffect } from "react";
import { getUser } from "@/api/auth-actions";
import { MonthlyData } from "@/types/calculate";
import browserClient from "@/utlis/supabase/browserClient";

export const useRecentMyFiveMonthsEmissions = (
  thisYear: number,
  thisMonth: number,
  monthsToFetch: number
) => {
  const [data, setData] = useState<MonthlyData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmissionsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // user_id를 가져오기
        const fetchedUser = await getUser();
        if (!fetchedUser) {
          setError("사용자를 가져오는 중 오류가 발생했습니다.");
          return;
        }

        const user_id = fetchedUser.id;

        let startMonth = thisMonth - monthsToFetch + 1;
        let startYear = thisYear;

        while (startMonth <= 0) {
          startMonth = 12 + startMonth;
          startYear--;
        }

        const targetDates = [];
        for (let i = 0; i < 5; i++) {
          let targetMonth = startMonth + i;
          let targetYear = startYear;

          while (targetMonth > 12) {
            targetMonth = targetMonth - 12;
            targetYear++;
          }

          targetDates.push({ year: targetYear, month: targetMonth });
        }

        // user_id 조건 추가하여 데이터 조회
        const { data, error } = await browserClient
          .from("carbon_records")
          .select("*")
          .eq("user_id", user_id)
          .or(
            targetDates
              .map((d) => `and(year.eq.${d.year},month.eq.${d.month})`)
              .join(",")
          )
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) {
          setError("데이터를 가져오는 중 오류가 발생했습니다:" + error.message);
          return;
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
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
        setError("데이터 로딩 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmissionsData();
  }, [thisYear, thisMonth, monthsToFetch]);

  return { data, isLoading, error };
};
