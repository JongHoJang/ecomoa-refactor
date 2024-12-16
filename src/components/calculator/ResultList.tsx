"use client";

import React, { useState } from "react";
import YearPicker from "./YearPicker";
import FormHeader from "../shared/FormHeader";
import HeaderTitle from "../layout/HeaderTitle";
import ResultItem from "./ResultItem";
import StatusMessage from "./StatusMessage";
import { useCarbonRecords } from "@/hooks/useCarbonRecords";

interface Props {
  type: string;
}

const ResultList = ({ type }: Props) => {
  const [thisYear, setThisYear] = useState<number | null>(null);

  const { data, isLoading } = useCarbonRecords({
    selectedYear: thisYear
  });

  const myAllData = data?.records || [];

  const handleYearChange = (year: number | null) => {
    setThisYear(year); // 선택한 연도를 업데이트
  };

  return (
    <>
      <div className="pt-[36px] md:pt-[76px] mb-[48px] md:mb-[60px]">
        {type === "calculate" ? (
          <>
            <div className="mb-[36px] md:mb-[48px] ">
              <FormHeader text="탄소 계산기 홈" location="/calculator" />
            </div>
          </>
        ) : (
          <>
            <div className="mb-[36px] md:mb-[48px] ">
              <FormHeader text="마이페이지" location="/mypage" />
            </div>
          </>
        )}
        <HeaderTitle
          title="탄소 배출량 계산 히스토리"
          description="이번 달 이산화탄소 배출량이 얼마나 발생했을지 확인해봅시다"
        />
      </div>

      {/* 탄소 계산 히스토리 셀렉박스 */}
      <div className="mb-[28px]">
        <div className="flex flex-col md:flex-row w-full min-w-[320px] h-[158px] md:h-[92px] bg-[#00320f] rounded-xl py-[30px] px-6 md:px-0 justify-between">
          <div className="flex flex-row md:justify-start md:items-center md:pl-6 text-[20px] text-white gap-2">
            탄소 계산 히스토리
            <div>{myAllData ? `${myAllData.length}건` : "0건"}</div>
          </div>
          <div className="flex items-center">
            <YearPicker
              thisYear={thisYear}
              onChangeYear={handleYearChange}
              disabled={false}
            />
          </div>
        </div>
      </div>

      {/* 리스트 시작 */}
      <div className="w-full min-w-[320px] md:max-w-[1200px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#D7E8D7] [&::-webkit-scrollbar-thumb]:bg-[#00691E] [&::-webkit-scrollbar-thumb]:rounded-full">
        {isLoading ? (
          <div className="flex flex-row w-full min-w-[320px] h-[500px] p-[24px] text-[16px]">
            <StatusMessage type="loading" />
          </div>
        ) : myAllData && myAllData.length > 0 ? (
          myAllData
            .sort((a, b) => {
              // 연도가 같으면 월로 비교
              if (a.year === b.year) {
                return b.month - a.month;
              }
              return b.year - a.year;
            })
            .map((data, index, array) => (
              <ResultItem
                key={new Date(data.created_at as string).toISOString()}
                data={data}
                showYear={index === 0 || data.year !== array[index - 1].year}
                index={index}
              />
            ))
        ) : (
          <div className="flex flex-row w-full min-w-[320px] h-[92px] p-[24px] text-[16px]">
            <StatusMessage type="empty" />
          </div>
        )}
      </div>
    </>
  );
};

export default ResultList;
