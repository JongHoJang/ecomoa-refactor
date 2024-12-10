import React from "react";
import ThisMonthChart from "@/components/calculator/ThisMonthChart";

type CarbonData = { carbon_emissions: number } | null;

interface EmissionUpAndDownProps {
  month: number;
  currentMonth: number;
  currentData: CarbonData;
  totalAvgData: CarbonData;
}

const EmissionUpAndDown: React.FC<EmissionUpAndDownProps> = ({
  month,
  currentMonth,
  currentData,
  totalAvgData
}) => {
  const emissionDifference =
    totalAvgData && currentData
      ? currentData.carbon_emissions < totalAvgData.carbon_emissions
        ? `평균보다 ${(
            100 -
            (currentData.carbon_emissions / totalAvgData.carbon_emissions) * 100
          ).toFixed(2)}% 낮아요!`
        : `평균보다 ${(
            (currentData.carbon_emissions / totalAvgData.carbon_emissions) *
              100 -
            100
          ).toFixed(2)}% 높아요!`
      : null;

  return (
    <div className="flex flex-col md:flex-row min-w-[320px] h-[484px] w-full md:h-[400px] rounded-[16px] md:justify-between items-center bg-[#00320F] pt-[40px] md:pt-0 px-[32px] mb-[58px] md:mb-[140px] md:px-[80px]">
      <div className="flex">
        <div className="flex flex-col">
          <div className="text-[24px] md:text-[36px] font-bold text-white mb-[28px] md:mb-[36px]">
            {Number(month) === currentMonth ? "이번 달" : `${month}월`} 총 탄소
            배출량은
          </div>
          <div className="text-[#FFD64E] text-[36px] md:text-[48px] font-semibold mb-[30px] md:mb-[40px]">
            {currentData?.carbon_emissions}kg
          </div>
          {emissionDifference && (
            <div className="text-[14px] md:text-[16px] text-white mb-[48px] md:mb-0">
              탄소 배출량이 {emissionDifference}
            </div>
          )}
        </div>
      </div>
      <div className="w-[256px] h-[256px] md:w-[288px] md:h-[288px] flex justify-center items-center bg-white rounded-[24px]">
        <ThisMonthChart
          currentData={currentData || null}
          totalAvgData={totalAvgData || null}
        />
      </div>
    </div>
  );
};

export default EmissionUpAndDown;
