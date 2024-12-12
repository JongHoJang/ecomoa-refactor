"use client";
import {
  loadRecentFiveMonthsEmissions,
  loadTopUsersData,
  loadUsersAvgData,
  TopData
} from "@/hooks/monthlyData";
import { MonthlyData } from "@/types/calculate";
import React, { useEffect, useState } from "react";
import { userStore } from "@/zustand/userStore";
import { UserInfo } from "@/types/userInfoType";
import { getUserInfo } from "@/api/user-action";
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

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const ResultPageMain = () => {
  const [userAvgData, setUserAvgData] = useState<number>(0);
  // const [myAllData, setMyAllData] = useState<MonthlyData[] | null>(null);
  // const [myAllAvgData, setMyAllAvgData] = useState<number>(0);
  const [userTopData, setUserTopData] = useState<TopData | null>(null);
  const [userAllData, setUserAllData] = useState<MonthlyData[] | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = userStore();

  // 유저 이미지 가지고 오기
  const levelInfo = calculateLevelInfo(userInfo?.user_point ?? 0);

  // loadMyData 대신 useCarbonRecords 사용
  const {
    myAllData,
    myAllAvgData,
    isLoading: isMyDataLoading
  } = useCarbonRecords({
    selectedYear: null
  });

  useEffect(() => {
    const getUserFetch = async () => {
      if (user?.id) {
        const res = await getUserInfo(user.id);
        setUserInfo(res);
      }
    };

    const fetchData = async () => {
      try {
        await Promise.all([
          loadUsersAvgData(setUserAvgData), // 유저 토탈 데이터
          loadTopUsersData(setUserTopData), // 유저 최고 데이터
          loadRecentFiveMonthsEmissions(currentYear, currentMonth, 2).then(
            (data) => {
              setUserAllData(data);
            }
          ),
          getUserFetch()
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading || isMyDataLoading) {
    return (
      <Loading
        message="탄소 배출량 히스토리 로딩 중"
        subMessage="잠시만 기다려 주세요~!"
      />
    );
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
                  userTopData={userTopData}
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
                  userAllData={userAllData}
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
