import Image from "next/image";
import React, { useState } from "react";

// 달력 선택 type 정리
export interface YearSelectProps {
  thisYear: number | null;
  thisMonth: number | null;
  onChangeYear: (year: number) => void;
  onChangeMonth: (month: number) => void;
  disabled: boolean;
}

const YearMonthPickerMain: React.FC<YearSelectProps> = ({
  thisYear,
  thisMonth,
  onChangeYear,
  onChangeMonth,
  disabled = false
}) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(thisYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(thisMonth);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const toggleYearDropdown = () => {
    if (!disabled) {
      setIsYearDropdownOpen((prev) => !prev);
      setIsMonthDropdownOpen(false); // 월 드롭다운 닫기
    }
  };

  const toggleMonthDropdown = () => {
    if (!disabled) {
      setIsMonthDropdownOpen((prev) => !prev);
      setIsYearDropdownOpen(false); // 연도 드롭다운 닫기
    }
  };

  const handleYearClick = (year: number) => {
    if (!disabled) {
      setSelectedYear(year);
      onChangeYear(year); // 연도 변경 핸들러 호출
      setIsYearDropdownOpen(false); // 연도 선택 후 드롭다운 닫기
    }
  };

  const handleMonthClick = (month: number) => {
    if (!disabled) {
      setSelectedMonth(month);
      onChangeMonth(month); // 월 변경 핸들러 호출
      setIsMonthDropdownOpen(false); // 월 선택 후 드롭다운 닫기
    }
  };

  const currentYear = new Date().getFullYear(); // 현재 연도 가져오기

  return (
    <div className="flex flex-row gap-[20px]">
      <div className="relative flex flex-col gap-[10px]">
        {/* 드롭다운 버튼 */}
        <button
          onClick={toggleYearDropdown}
          className="w-[136px] h-[48px] md:w-[162px] md:h-[60px] bg-[#00320f] rounded-[12px] justify-start items-center inline-flex text-white p-[12px]"
        >
          {/* whitespace-nowrap 속성 추가 */}
          <div className="flex flex-row items-center mx-auto gap-[12px]">
            <div className="text-[20px] font-medium whitespace-nowrap">
              {selectedYear && selectedMonth
                ? `${selectedYear}년`
                : `${selectedYear}년`}
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
          <div className="absolute top-[100%] mt-[16px] flex flex-col w-[136px] md:w-[162px] bg-white rounded-xl text-[20px] z-10 border border-[#d5d7dd] text-center overflow-hidden">
            {Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i)
              .sort((a, b) => b - a)
              .map((year) => (
                <div
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`dropdown-item py-[16px] ${
                    selectedYear === year
                  } w-full hover:bg-[#E8F3E8]`}
                >
                  {year}년
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 월 드롭다운 버튼 */}
      <div className="relative flex flex-col gap-[10px]">
        <button
          onClick={toggleMonthDropdown}
          className="w-[112px] h-[48px] md:w-[125px] md:h-[60px] bg-[#00320f] rounded-[12px] justify-start items-center inline-flex text-white p-[12px]"
        >
          <div className="flex flex-row items-center mx-auto gap-[12px]">
            <div className="text-[20px] font-medium whitespace-nowrap">
              {/* whitespace-nowrap 속성 추가 */}
              {selectedMonth
                ? `${String(selectedMonth).padStart(2, "0")}월`
                : "월 선택"}
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

        {/* 월 드롭다운 */}
        {isMonthDropdownOpen && (
          <div className="absolute top-[100%] mt-[16px] flex flex-col w-[112px] md:w-[125px] bg-white rounded-xl text-[20px] z-10 border border-[#d5d7dd] text-center overflow-hidden">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i + 1}
                onClick={() => handleMonthClick(i + 1)}
                className={`dropdown-item py-[16px] ${
                  selectedMonth === i + 1 ? "selected" : ""
                } w-full hover:bg-[#E8F3E8]`}
              >
                {String(i + 1).padStart(2, "0")}월
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YearMonthPickerMain;
