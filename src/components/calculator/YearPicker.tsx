import Image from "next/image";
import React, { useState } from "react";

// 달력 선택 type 정리
export interface YearSelectProps {
  thisYear: number | null;
  onChangeYear: (year: number | null) => void;
  disabled: boolean;
}

const YearPicker: React.FC<YearSelectProps> = ({
  thisYear,
  onChangeYear,
  disabled = false
}) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(thisYear);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const toggleYearDropdown = () => {
    if (!disabled) {
      setIsYearDropdownOpen((prev) => !prev);
    }
  };

  const handleYearClick = (year: number | null) => {
    if (!disabled) {
      setSelectedYear(year);
      onChangeYear(year); // 연도 변경 핸들러 호출
      setIsYearDropdownOpen(false); // 연도 선택 후 드롭다운 닫기
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-row gap-[20px]">
      <div className="relative flex flex-col gap-[10px]">
        {/* 드롭다운 버튼 */}
        <button
          onClick={toggleYearDropdown}
          className="w-[162px] h-[60px] bg-[#0D9C36] rounded-[12px] justify-start items-center inline-flex text-white p-[12px] mr-[32px]"
        >
          {/* whitespace-nowrap 속성 추가 */}
          <div className="flex flex-row items-center mx-auto gap-[12px]">
            <div className="text-[20px] font-medium whitespace-nowrap">
              {selectedYear === null ? `전체` : `${selectedYear}년`}
            </div>
            <div>
              <Image
                src="/calculate/ic_round-expand-more.svg"
                alt="YearPicker"
                width={24}
                height={24}
              />
            </div>
          </div>
        </button>

        {/* 연도 드롭다운 */}
        {isYearDropdownOpen && (
          <div className="absolute top-[100%] mt-[16px] flex flex-col w-[162px] bg-white rounded-xl text-[20px] z-10 border border-[#d5d7dd] text-center overflow-hidden">
            {/* "전체" 항목 추가 */}
            <div
              onClick={() => handleYearClick(null)} // 전체 선택 시 null로 설정
              className={`dropdown-item py-[16px] ${
                selectedYear === null ? "bg-[#E8F3E8]" : ""
              } w-full hover:bg-[#E8F3E8]`}
            >
              전체
            </div>

            {Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i)
              .sort((a, b) => b - a) // 내림차순 정렬
              .map((year) => (
                <div
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`dropdown-item py-[16px] ${
                    selectedYear === year ? "bg-[#E8F3E8]" : ""
                  } w-full hover:bg-[#E8F3E8]`}
                >
                  {year}년
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YearPicker;
