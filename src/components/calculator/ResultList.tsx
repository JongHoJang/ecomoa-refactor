"use client";

import { loadMyAllData } from "@/hooks/monthlyData";
import { MonthlyData } from "@/types/calculate";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import YearPicker from "./YearPicker";
import FormHeader from "../shared/FormHeader";
import HeaderTitle from "../layout/HeaderTitle";

interface Props {
  type: string;
}

const ResultList = ({ type }: Props) => {
  const [myAllData, setMyAllData] = useState<MonthlyData[] | null>(null);
  const [thisYear, setThisYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await loadMyAllData(setMyAllData, thisYear);
      setIsLoading(false);
    };
    fetchData();
  }, [thisYear]);

  const handleYearChange = (year: number | null) => {
    setThisYear(year); // 연도 변경
    loadMyAllData(setMyAllData, year); // 연도에 맞는 데이터 로드
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
            <div className="flex items-center justify-center mx-auto">
              <p className="text-gray-500 text-[16px]">
                데이터를 가지고 오는 중 입니다...
              </p>
            </div>
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
            .map((data, index, array) => {
              const showYear =
                index === 0 || data.year !== array[index - 1].year; // 첫 항목이거나 이전 항목과 연도가 다를 때만 표시

              return (
                <div key={new Date(data.created_at as string).toISOString()}>
                  {showYear && (
                    <div className="text-[14px] font-bold mt-[20px] mb-[4px] ml-4">
                      {data.year}년도
                    </div>
                  )}
                  <Link href={`/calculator/result/${data.year}/${data.month}`}>
                    <div className="flex flex-row h-[92px] p-[24px]">
                      <Image
                        src={
                          index % 2 === 0
                            ? "/calculate/History_Icon_Blue.svg"
                            : "/calculate/History_Icon_Red.svg"
                        }
                        alt={"electricity_color"}
                        width={48}
                        height={48}
                      />
                      <div className="flex flex-col justify-center ml-5 gap-[16px]">
                        <div className="text-[20px] font-semibold">
                          {data.month}월 탄소 계산 결과표
                        </div>
                        <div className="text-[#A1A7B4]">
                          {format(
                            new Date(data.created_at as string),
                            "yyyy. MM. dd"
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="w-full h-[1px] bg-gray-300 my-1 px-2"></div>
                </div>
              );
            })
        ) : (
          <div className="flex flex-row w-full min-w-[320px] h-[92px] p-[24px] text-[16px]">
            <div className="flex items-center justify-center mx-auto">
              <p className="text-gray-500 text-lg">
                탄소계산기를 통해 계산한 데이터가 없습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultList;
