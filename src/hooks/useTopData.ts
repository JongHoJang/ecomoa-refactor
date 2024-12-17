"use client";

import { useState, useEffect } from "react";
import browserClient from "@/utlis/supabase/browserClient";

type TopData = {
  user_id: string;
  carbon_emissions: number;
};

export const useTopUsersData = () => {
  const [topUser, setTopUser] = useState<TopData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopUsersData = async () => {
      try {
        const { data, error } = await browserClient
          .from("carbon_records")
          .select("user_id, carbon_emissions");

        if (error) {
          setError("데이터를 가져오는 중 오류가 발생했습니다.");
          setTopUser(null);
          return;
        }

        if (data && data.length > 0) {
          // 유저별로 carbon_emissions 평균값 계산
          const userCarbonEmissionsMap: Record<
            string,
            { total: number; count: number }
          > = {};

          data.forEach((record) => {
            const { user_id, carbon_emissions } = record;

            if (!userCarbonEmissionsMap[user_id]) {
              userCarbonEmissionsMap[user_id] = { total: 0, count: 0 };
            }

            userCarbonEmissionsMap[user_id].total += carbon_emissions;
            userCarbonEmissionsMap[user_id].count += 1;
          });

          // 각 유저의 평균 carbon_emissions 값 계산
          let topUserData: TopData | null = null;
          let highestAvgCarbonEmissions = 0;

          Object.keys(userCarbonEmissionsMap).forEach((userId) => {
            const { total, count } = userCarbonEmissionsMap[userId];
            const avgCarbonEmissions = total / count;

            if (avgCarbonEmissions > highestAvgCarbonEmissions) {
              highestAvgCarbonEmissions = avgCarbonEmissions;
              topUserData = {
                user_id: userId,
                carbon_emissions: avgCarbonEmissions
              };
            }
          });

          setTopUser(topUserData); // 가장 높은 평균값을 가진 유저의 데이터를 상태에 설정
        } else {
          setTopUser(null); // 데이터가 없을 경우 null로 설정
        }
      } catch (err) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다.", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setTopUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopUsersData();
  }, []);

  return { topUser, isLoading, error };
};
