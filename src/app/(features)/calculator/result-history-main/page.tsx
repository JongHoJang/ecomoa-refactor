"use client";
import { userStore } from "@/zustand/userStore";
import { calculateLevelInfo } from "@/utlis/challenge/levelCalculator";
import FormHeader from "@/components/shared/FormHeader";
import Loading from "@/components/calculator/Loading";
import CompareMonthlyEmissions from "@/components/calculator/CompareMonthlyEmissions";
import HistoryCompareCard from "@/components/calculator/HistoryCompareCard";
import HeaderTitle from "@/components/layout/HeaderTitle";
import CalculateUserCard from "@/components/calculator/CalculateUserCard";
import EmissionLeftSide from "@/components/calculator/EmissionHeader";
import EmissionProgressBar from "@/components/calculator/EmissionProgressBar";
import TreeCalculationCard from "@/components/calculator/TreeCalculationCard";
import CompareChartLabel from "@/components/calculator/CompareChartLabel";
import { useCarbonRecords } from "@/hooks/useCarbonRecords";
import { useUsersAvgData } from "@/hooks/useUsersAvgData";
import { useTopUsersData } from "@/hooks/useTopData";
import { useUserFetch } from "@/hooks/useUserFetch";
import { useRecentFiveMonthsEmissions } from "@/hooks/useRecentFiveMonthsEmissions";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const ResultPageMain = () => {
  // 유저정보 가지고 오기
  const { user } = userStore();

  const { userInfo, isLoading: isUserInfoLoading } = useUserFetch(
    user?.id ?? null
  );

  // 유저 이미지 가지고 오기
  const levelInfo = calculateLevelInfo(userInfo?.user_point ?? 0);

  // 내 데이터값 가지고 오기
  const {
    myAllData,
    myAllAvgData,
    isLoading: isMyDataLoading
  } = useCarbonRecords({
    selectedYear: null
  });

  // 유저 평균 데이터값 가지고 오기
  const {
    userAvgData,
    isLoading: isAvgDataLoading,
    error: userAvgDataError
  } = useUsersAvgData();

  // 제일 높은 데이터값 가지고 오기
  const {
    topUser,
    isLoading: isTopUserLoading,
    error: topUserError
  } = useTopUsersData();

  // 유저평균 최신달 2개 가지고 오기
  const {
    data: emissionsData,
    isLoading: isEmissionsLoading,
    error: emissionsError
  } = useRecentFiveMonthsEmissions(currentYear, currentMonth, 2);

  if (
    isMyDataLoading ||
    isAvgDataLoading ||
    isTopUserLoading ||
    isUserInfoLoading ||
    isEmissionsLoading
  ) {
    return (
      <Loading
        message="탄소 배출량 히스토리 로딩 중"
        subMessage="잠시만 기다려 주세요~!"
      />
    );
  }

  if (userAvgDataError || topUserError || emissionsError) {
    return <div>에러가 발생했습니다.</div>;
  }
  return (
    <>
      <div className="bg-[#F2F9F2] min-h-full">
        <div className="w-full min-w-[360px] max-w-[1200px] mx-auto">
          <div className="px-[20px] md:px-[0px]">
            {/* 페이지 header */}
            <div className="mb-[58px] md:mb-[80px]">
              <div className="pt-[76px] mb-[36px] md:mb-[48px] ">
                <FormHeader text="탄소 계산기 홈" location="/calculator" />
              </div>
              <HeaderTitle
                title="탄소 배출량 계산 히스토리"
                description="이전에 계산한 나의 탄소 배출량 히스토리를 확인해봅시다"
              />
            </div>

            {/* 나의 탄소 히스토리 최상단 데이터 */}
            <CalculateUserCard
              userInfo={userInfo}
              myAllData={myAllData}
              levelInfo={levelInfo}
            />

            {/* 배출량 현황 */}
            <div>
              <p className="text-[14px] md:text-[24px] font-semibold mb-[20px] md:mb-[32px]">
                배출량 현황
              </p>
              <div className="flex flex-col md:flex-row min-w-[320px] w-full h-[356px] md:h-[300px] rounded-[16px] justify-between items-center pt-[40px] py-[20px] px-[40px] md:px-[80px] mb-[12px] md:mb-[24px] bg-white border border-[#dcecdc]">
                <div className="flex flex-col">
                  <EmissionLeftSide
                    userNickname={userInfo?.user_nickname || ""}
                    avgEmission={myAllAvgData}
                    userAvgData={userAvgData}
                    myAllAvgData={myAllAvgData}
                  />
                </div>
                {/* 프로그레스바 */}
                <EmissionProgressBar
                  myAllAvgData={myAllAvgData}
                  userTopData={topUser}
                  userAvgData={userAvgData}
                  levelInfo={levelInfo}
                  userInfo={userInfo}
                />
              </div>
            </div>

            {/* 나무 영역 */}
            <TreeCalculationCard
              myAllAvgData={myAllAvgData}
              myAllData={myAllData}
              userAvgData={userAvgData}
            />

            {/* 최근 5개월 배출량 추이 */}
            <div className="pb-[80px]">
              <p className="text-[14px] md:text-[24px] font-semibold mb-[12px] md:mb-[24px]">
                최근 5개월 배출량 추이
              </p>

              {/* 차트 라벨 */}
              <div className="flex flex-row gap-2 text-[12px] md:text-[14px] justify-end right-0 mt-[20px] relative">
                <CompareChartLabel />
              </div>

              {/* 차트 */}
              <div className=" w-full min-w-[320px] md:w-full h-[400px] flex justify-center items-center bg-white border border-[#DCECDC] rounded-[15px] overflow-hidden">
                <div className="w-full h-full overflow-x-auto md:flex md:justify-center md:items-center md:overflow-x-hidden">
                  <CompareMonthlyEmissions />
                </div>
              </div>
              <div>
                <HistoryCompareCard
                  myAllData={myAllData}
                  userAllData={emissionsData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPageMain;
