import { getUser } from "@/api/auth-actions";
import { MonthlyData } from "@/types/calculate";
import browserClient from "@/utlis/supabase/browserClient";

// 월별 내 data 패칭
export const useLoadMyEmissionData = async (
  thisYear: number | null,
  thisMonth: number | null,
  setCurrentData: React.Dispatch<React.SetStateAction<MonthlyData | null>>
) => {
  const fetchedUser = await getUser();
  if (fetchedUser) {
    const { data, error } = await browserClient
      .from("carbon_records")
      .select("*")
      .eq("user_id", fetchedUser.id)
      .eq("year", thisYear)
      .eq("month", thisMonth);

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    // 가져온 데이터를 상태에 업데이트
    if (data && data.length > 0) {
      setCurrentData(data[0]); // 데이터가 있을 경우 업데이트
    } else {
      setCurrentData(null); // 데이터가 없으면 null로 설정
    }
  }
};
