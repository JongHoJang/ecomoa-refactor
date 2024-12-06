"use client";
import YearMonthPickerMain from "@/components/calculator/YearMonthPickerMain";
import InputFiledSection from "@/components/calculator/InputFiledSection";
import FormHeader from "@/components/shared/FormHeader";
import HeaderTitle from "@/components/layout/HeaderTitle";
import useCarbonCalculator from "@/hooks/useCarbonCalculator";

const Page = () => {
  const {
    thisYear,
    thisMonth,
    fuelType,
    setThisYear,
    setThisMonth,
    setFuelType,
    onSubmit
  } = useCarbonCalculator();

  // 연도와 달 handler
  const handleYearChange = (year: number) => {
    setThisYear(year);
  };
  const handleMonthChange = (month: number) => {
    setThisMonth(month);
  };

  return (
    <>
      <div className="w-full min-w-[360px] max-w-[1200px] mx-auto">
        <div className="px-[20px] md:px-[0px] mb-[80px]">
          {/* 페이지 header */}
          <div className="mb-[58px] md:mb-[80px]">
            <div className="pt-[76px] mb-[36px] md:mb-[48px] ">
              <FormHeader text="탄소 계산기 홈" location="/calculator" />
            </div>
            <HeaderTitle
              title="탄소 배출량 계산 결과표"
              description="이번 달 이산화탄소 배출량을 계산해 보세요"
            />
          </div>

          {/* 날짜 선택 드롭다운 */}
          <div className="flex mb-[44px] md:mb-[36px]">
            <YearMonthPickerMain
              thisYear={thisYear}
              thisMonth={thisMonth}
              onChangeYear={handleYearChange}
              onChangeMonth={handleMonthChange}
              disabled={false}
            />
          </div>

          {/* 인풋박스 */}
          <div className="flex flex-col mb-[44px] md:mb-[48px] gap-[10px]">
            <InputFiledSection
              fuelType={fuelType}
              setFuelType={setFuelType}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;
