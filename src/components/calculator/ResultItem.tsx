import { MonthlyData } from "@/types/calculate";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import React from "react";

const ResultItem = ({
  data,
  showYear,
  index
}: {
  data: MonthlyData;
  showYear: boolean;
  index: number;
}) => (
  <div>
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
            {format(new Date(data.created_at as string), "yyyy. MM. dd")}{" "}
          </div>
        </div>
      </div>
    </Link>
    <div className="w-full h-[1px] bg-gray-300 my-1 px-2"></div>
  </div>
);

export default ResultItem;
