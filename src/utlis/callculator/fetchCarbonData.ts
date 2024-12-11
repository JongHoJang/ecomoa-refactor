import { getUser } from "@/api/auth-actions";
import { MonthlyData } from "@/types/calculate";
import browserClient from "../supabase/browserClient";

export const fetchMyCarbonData = async (
  thisYear: number,
  thisMonth: number
): Promise<MonthlyData | null> => {
  const fetchedUser = await getUser();
  if (!fetchedUser) return null;

  const { data, error } = await browserClient
    .from("carbon_records")
    .select("*")
    .eq("user_id", fetchedUser.id)
    .eq("year", thisYear)
    .eq("month", thisMonth);

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error(error.message); // React Query에서 에러 처리 가능
  }

  return data && data.length > 0 ? data[0] : null;
};

export const fetchUserCarbonData = async (
  thisYear: number | null,
  thisMonth: number | null
): Promise<MonthlyData | null> => {
  const { data, error } = await browserClient
    .from("carbon_records")
    .select("*")
    .eq("year", thisYear)
    .eq("month", thisMonth);

  if (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
    return null; // 오류 발생 시 null 반환
  }

  if (data.length > 0) {
    return {
      year: thisYear ?? 0, // currentYear가 null일 경우 0으로 대체
      month: thisMonth ?? 0, // currentMonth가 null일 경우 0으로 대체
      water_usage: parseFloat(
        (
          data.reduce((acc, record) => acc + record.water_usage, 0) /
          data.length
        ).toFixed(2)
      ),
      water_co2: parseFloat(
        (
          data.reduce((acc, record) => acc + record.water_co2, 0) / data.length
        ).toFixed(2)
      ),
      gas_usage: parseFloat(
        (
          data.reduce((acc, record) => acc + record.gas_usage, 0) / data.length
        ).toFixed(2)
      ),
      gas_co2: parseFloat(
        (
          data.reduce((acc, record) => acc + record.gas_co2, 0) / data.length
        ).toFixed(2)
      ),
      electricity_usage: parseFloat(
        (
          data.reduce((acc, record) => acc + record.electricity_usage, 0) /
          data.length
        ).toFixed(2)
      ),
      electricity_co2: parseFloat(
        (
          data.reduce((acc, record) => acc + record.electricity_co2, 0) /
          data.length
        ).toFixed(2)
      ),
      waste_volume: parseFloat(
        (
          data.reduce((acc, record) => acc + record.waste_volume, 0) /
          data.length
        ).toFixed(2)
      ),
      waste_co2: parseFloat(
        (
          data.reduce((acc, record) => acc + record.waste_co2, 0) / data.length
        ).toFixed(2)
      ),
      carbon_emissions: parseFloat(
        (
          data.reduce((acc, record) => acc + record.carbon_emissions, 0) /
          data.length
        ).toFixed(2)
      ),
      car_usage: parseFloat(
        (
          data.reduce((acc, record) => acc + record.car_usage, 0) / data.length
        ).toFixed(2)
      ),
      car_co2: parseFloat(
        (
          data.reduce((acc, record) => acc + record.car_co2, 0) / data.length
        ).toFixed(2)
      )
    };
  }

  return null; // 데이터가 없으면 null 반환
};
