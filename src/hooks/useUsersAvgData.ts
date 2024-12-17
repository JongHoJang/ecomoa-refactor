// // 전체 유저들의 carbon_emissions 평균값

import { useQuery } from "@tanstack/react-query";
import browserClient from "@/utlis/supabase/browserClient";

// 데이터 fetching 함수
const fetchUserAvgData = async () => {
  const { data, error } = await browserClient
    .from("carbon_records")
    .select("carbon_emissions");

  if (error) {
    throw new Error("데이터를 가지고 오지 못했습니다.");
  }

  if (data && Array.isArray(data) && data.length > 0) {
    const totalEmission = data.reduce(
      (sum, record) => sum + (record.carbon_emissions || 0),
      0
    );
    return totalEmission / data.length;
  }

  return 0; // 데이터가 없으면 0을 반환
};

export const useUsersAvgData = () => {
  const {
    data: userAvgData = 0,
    isLoading,
    error
  } = useQuery({
    queryKey: ["userAvgData"],
    queryFn: fetchUserAvgData,
    staleTime: 1000 * 60 * 5,
    // cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  });

  return { userAvgData, isLoading, error };
};
