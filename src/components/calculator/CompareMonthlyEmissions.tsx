import { useRecentMyFiveMonthsEmissions } from "@/hooks/useRecentMyFiveMonthsEmissions";
import Loading from "./Loading";
import MonthlyChartMain from "./MonthlyChartMain";
import { useRecentFiveMonthsEmissions } from "@/hooks/useRecentFiveMonthsEmissions";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const CompareMonthlyEmissions = () => {
  const {
    data: emissionsData,
    isLoading: isEmissionsLoading,
    error: emissionsError
  } = useRecentFiveMonthsEmissions(currentYear, currentMonth, 5);

  const {
    data: currentData,
    isLoading: isCurrentLoading,
    error: currentDataError
  } = useRecentMyFiveMonthsEmissions(currentYear, currentMonth, 5);

  if (isEmissionsLoading || isCurrentLoading) {
    return (
      <Loading
        message="탄소 배출량 히스토리 로딩 중"
        subMessage="잠시만 기다려 주세요~!"
      />
    );
  }

  if (currentDataError || emissionsError) {
    return <div>에러가 발생했습니다.</div>;
  }

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
