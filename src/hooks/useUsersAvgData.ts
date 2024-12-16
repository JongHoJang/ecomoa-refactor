// // 전체 유저들의 carbon_emissions 평균값

// import { useState, useEffect } from "react";
// import browserClient from "@/utlis/supabase/browserClient";

// export const useUsersAvgData = () => {
//   const [userAvgData, setUserAvgData] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchAvgData = async () => {
//       try {
//         const { data, error } = await browserClient
//           .from("carbon_records")
//           .select("carbon_emissions");

//         if (error) {
//           setError("데이터를 가지고 오지 못했습니다.");
//           setUserAvgData(0);
//           return;
//         }

//         if (data && Array.isArray(data) && data.length > 0) {
//           const totalEmission = data.reduce(
//             (sum, record) => sum + (record.carbon_emissions || 0),
//             0
//           );
//           const avgEmission = totalEmission / data.length;
//           setUserAvgData(avgEmission); // 평균값 설정
//         } else {
//           setUserAvgData(0);
//         }
//       } catch (err) {
//         console.error("데이터를 불러오는 중 오류가 발생했습니다:", err);
//         setError("데이터를 불러오는 중 오류가 발생했습니다.");
//         setUserAvgData(0);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAvgData();
//   }, []);

//   return { userAvgData, isLoading, error };
// };

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
    queryKey: ["userAvgData"], // 쿼리 키
    queryFn: fetchUserAvgData, // 데이터 가져오는 함수
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시된 데이터를 사용
    // cacheTime: 1000 * 60 * 10, // 10분 후 캐시에서 삭제
    refetchOnWindowFocus: false // 창 포커스를 다시 받을 때마다 refetch하지 않음
  });

  return { userAvgData, isLoading, error };
};
