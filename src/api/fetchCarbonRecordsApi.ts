import { MonthlyData } from "@/types/calculate";
import browserClient from "@/utlis/supabase/browserClient";

export const fetchCarbonRecords = async (
  userId: string,
  selectedYear: number | null
): Promise<MonthlyData[] | null> => {
  let query = browserClient
    .from("carbon_records")
    .select("*, created_at, carbon_emissions")
    .eq("user_id", userId);

  if (selectedYear !== null) {
    query = query.eq("year", selectedYear);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching carbon records:", error);
    return null;
  }

  return data && Array.isArray(data)
    ? data.sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.month - b.month;
      })
    : null;
};
