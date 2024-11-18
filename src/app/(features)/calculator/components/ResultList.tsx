"use client";

import { loadMyAllData } from "@/hooks/monthlyData";
import { MonthlyData } from "@/types/calculate";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import YearPicker from "../components/YearPicker";

interface Props {
  type: string;
}

const ResultList = ({ type }: Props) => {
  const [myAllData, setMyAllData] = useState<MonthlyData[] | null>(null);
  const [thisYear, setThisYear] = useState<number | null>(null);

  useEffect(() => {
    // 초기 로딩 시 currentYear 데이터를 불러옴
    loadMyAllData(setMyAllData, thisYear);
  }, [thisYear]);

  const handleYearChange = (year: number | null) => {
    setThisYear(year); // 연도 변경
    loadMyAllData(setMyAllData, year); // 연도에 맞는 데이터 로드
  };

  return (
    <div className="w-full min-w-[360px] max-w-[1200px] mx-auto">
      <div className="mt-[36px] md:mt-[76px] mb-[48px] md:mb-[60px]">
        {type === "calculate" ? (
          <>
            <Link href="/calculator/result-history-main">
              <p className="text-[16px]"> &lt; 탄소 계산기 홈</p>
            </Link>
            <div className="w-full h-[1px] bg-gray-300 my-4 mb-[36px]"></div>
          </>
        ) : (
          <>
            <Link href="/mypage">
              <p className="text-[16px]"> &lt; 마이페이지</p>
            </Link>
            <div className="w-full h-[1px] bg-gray-300 my-4 mb-[36px]"></div>
          </>
        )}
        <div className="mb-[58px] md:mb-[80px] leading-[1] md:leading-[80%]">
          <p className="text-[#32343a] text-[24px] md:text-[30px] font-semibold mb-[16px] md:mb-[28px]">
            탄소 배출량 계산 히스토리
          </p>
          <p className=" text-[16px] md:text-[20px] font-normal text-[#00691E]">
            이번 달 이산화탄소 배출량이 얼마나 발생했을지 확인해봅시다
          </p>
        </div>
      </div>

      {/* 탄소 계산 히스토리 셀렉박스 */}
      <div className="mb-[28px]">
        <div className="flex flex-col md:flex-row w-full h-[158px] md:h-[92px] bg-[#00320f] rounded-xl py-[30px] px-6 md:px-0 justify-between">
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
      <div className="w-full">
        {myAllData && myAllData.length > 0 ? (
          myAllData
            .sort((a, b) => {
              // 연도가 같으면 월로 비교
              if (a.year === b.year) {
                return b.month - a.month;
              }
              return b.year - a.year;
            })
            .map((data, index) => (
              <Link
                key={new Date(data.created_at as string).toISOString()}
                href={`/calculator/result/${data.year}/${data.month}`}
              >
                <div className="flex flex-row w-[1120px] h-[92px] p-[24px]">
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
                <div className="flex items-center justify-center w-full">
                  <div className="w-full h-[1px] bg-gray-300" />
                </div>
              </Link>
            ))
        ) : (
          <div className="mt-[50px]">데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default ResultList;