import { getUser } from "@/api/auth-actions";
import { MonthlyData } from "@/types/calculate";
import browserClient from "@/utlis/supabase/browserClient";

// 내 데이터 패칭
export const loadMyData = async ({
  setMyAllData,
  setMyAllAvgData,
  selectedYear
}: {
  setMyAllData?: React.Dispatch<React.SetStateAction<MonthlyData[] | null>>;
  setMyAllAvgData?: React.Dispatch<React.SetStateAction<number>>;
  selectedYear: number | null;
}) => {
  const fetchedUser = await getUser();
  if (!fetchedUser) {
    // 유저 정보가 없으면 상태를 초기화
    if (setMyAllData) setMyAllData(null);
    if (setMyAllAvgData) setMyAllAvgData(0);
    return;
  }

  let query = browserClient
    .from("carbon_records")
    .select("*, created_at, carbon_emissions")
    .eq("user_id", fetchedUser.id);

  // selectedYear가 null이 아닐 때만 연도 필터 추가
  if (selectedYear !== null) {
    query = query.eq("year", selectedYear);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching data:", error);
    if (setMyAllData) setMyAllData(null);
    if (setMyAllAvgData) setMyAllAvgData(0);
    return;
  }

  // 정렬 추가: year > month 순서
  const sortedData =
    data && Array.isArray(data)
      ? data.sort((a, b) => {
          if (a.year !== b.year) {
            return a.year - b.year; // 연도 기준 오름차순
          }
          return a.month - b.month; // 연도가 같으면 월 기준 오름차순
        })
      : null;

  // 전체 데이터 업데이트
  if (setMyAllData) {
    setMyAllData(sortedData && sortedData.length > 0 ? sortedData : null);
  }

  // 평균값 계산 및 업데이트
  if (setMyAllAvgData && sortedData && sortedData.length > 0) {
    const totalEmission = sortedData.reduce(
      (sum, record) => sum + (record.carbon_emissions || 0),
      0
    );
    const avgEmission = totalEmission / sortedData.length;
    setMyAllAvgData(avgEmission);
  } else if (setMyAllAvgData) {
    setMyAllAvgData(0);
  }
};

// 월별 내 data 패칭
export const loadUserAndFetchData = async (
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

// 이번달 기준 전체 유저 data의 각 칼럼의 평균값
export const loadTotalUsersData = async (
  thisYear: number | null,
  thisMonth: number | null,
  setTotalAvgData: React.Dispatch<React.SetStateAction<MonthlyData | null>>
) => {
  const { data, error } = await browserClient
    .from("carbon_records")
    .select("*")
    .eq("year", thisYear)
    .eq("month", thisMonth);

  if (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
  } else if (data.length > 0) {
    const avgData: MonthlyData = {
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

    setTotalAvgData(avgData);
  }
};

// 전체 유저들의 carbon_emissions 평균값
export const loadUsersAvgData = async (
  setUserAvgData: React.Dispatch<React.SetStateAction<number>>
) => {
  setUserAvgData(0);

  const fetchedUser = await getUser();
  if (fetchedUser) {
    const { data, error } = await browserClient
      .from("carbon_records")
      .select("carbon_emissions");

    if (error) {
      console.error("데이터를 가지고 오지 못했습니다:", error);
      setUserAvgData(0);
      return;
    }

    if (data && Array.isArray(data) && data.length > 0) {
      const totalEmission = data.reduce(
        (sum, record) => sum + (record.carbon_emissions || 0),
        0
      );
      const avgEmission = totalEmission / data.length;
      setUserAvgData(avgEmission); // 평균값을 설정
    } else {
      setUserAvgData(0);
    }
  } else {
    setUserAvgData(0);
  }
};

// 5달치 평균 배출량
export const loadRecentFiveMonthsEmissions = async (
  thisYear: number,
  thisMonth: number,
  monthsToFetch: number
) => {
  try {
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

    const { data, error } = await browserClient
      .from("carbon_records")
      .select("*")
      .or(
        targetDates
          .map((d) => `and(year.eq.${d.year},month.eq.${d.month})`)
          .join(",")
      );

    if (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
      return null;
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
              monthData.reduce((acc, cur) => acc + cur.electricity_usage, 0) /
              monthData.length
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
              monthData.reduce((acc, cur) => acc + cur.carbon_emissions, 0) /
              monthData.length
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

    return groupedData;
  } catch (error) {
    console.error("데이터 로딩 중 오류 발생:", error);
    return null;
  }
};

// 내 5달치 데이터
export const loadMyRecentFiveMonthsEmissions = async (
  thisYear: number,
  thisMonth: number,
  monthsToFetch: number
) => {
  try {
    // user_id를 가져오기
    const fetchedUser = await getUser();
    if (!fetchedUser) {
      console.error("사용자를 가져오는 중 오류가 발생했습니다.");
      return null;
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
      console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
      return null;
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
              monthData.reduce((acc, cur) => acc + cur.electricity_usage, 0) /
              monthData.length
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
              monthData.reduce((acc, cur) => acc + cur.carbon_emissions, 0) /
              monthData.length
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

    return groupedData;
  } catch (error) {
    console.error("데이터 로딩 중 오류 발생:", error);
    return null;
  }
};

export interface TopData {
  user_id: string;
  carbon_emissions: number;
}

// 전체중에 제일 높은 데이터
export const loadTopUsersData = async (
  setTotalAvgData: React.Dispatch<React.SetStateAction<TopData | null>>
) => {
  const { data, error } = await browserClient
    .from("carbon_records")
    .select("user_id, carbon_emissions");

  if (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
  } else if (data.length > 0) {
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
    let topUser: TopData | null = null;
    let highestAvgCarbonEmissions = 0;

    Object.keys(userCarbonEmissionsMap).forEach((userId) => {
      const { total, count } = userCarbonEmissionsMap[userId];
      const avgCarbonEmissions = total / count;

      if (avgCarbonEmissions > highestAvgCarbonEmissions) {
        highestAvgCarbonEmissions = avgCarbonEmissions;
        topUser = { user_id: userId, carbon_emissions: avgCarbonEmissions };
      }
    });

    // 가장 높은 평균값을 가진 유저의 데이터를 상태에 설정
    setTotalAvgData(topUser);
  } else {
    setTotalAvgData(null); // 데이터가 없을 경우 null로 설정
  }
};
