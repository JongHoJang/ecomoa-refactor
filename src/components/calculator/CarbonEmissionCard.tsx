import Image from "next/image";
import React from "react";
import Card from "./CardLayout";

export interface CarbonEmissionCardProps {
  logo: string;
  title: string;
  usageValue: number | undefined;
  co2Value: number | undefined;
  unit: string;
  isHighest: boolean;
  isLowest: boolean;
}

const CarbonEmissionCard: React.FC<CarbonEmissionCardProps> = ({
  logo,
  title,
  usageValue,
  co2Value,
  unit,
  isHighest,
  isLowest
}) => {
  return (
    <div className="flex min-w-[320px] md:max-w-[585px] h-[200px] md:h-[240px] p-[20px] md:p-[30px] bg-white rounded-2xl border border-[#edeef0]">
      <div className="flex flex-col gap-5 w-full">
        {/* 카드 상단 */}
        <div className="flex flex-row justify-between">
          {/* 아이콘과 타이틀 */}
          <div className="flex flex-row items-center gap-2">
            <Image src={logo} alt={logo} width={36} height={36} />
            <div className="text-[#000301] text-[16px] md:text-[21px] font-semibold">
              {title}
            </div>
          </div>

          {/* 태그 */}
          <div className="text-[12px] md:text-[14px]">
            {isHighest && (
              <div className="h-8 px-4 py-2.5 rounded-[32px] border border-[#525660] items-center gap-2.5">
                가장 많은 배출량
              </div>
            )}
            {isLowest && (
              <div className="h-8 px-4 py-2.5 rounded-[32px] border border-[#525660] items-center gap-2.5">
                가장 적은 배출량
              </div>
            )}
          </div>
        </div>

        {/* 카드 데이터 */}
        <div className="w-full flex flex-row justify-between gap-5">
          <Card
            title="에너지 사용량"
            value={usageValue ?? 0} // 기본값 0 설정
            unit={unit}
            bgColor="bg-[#f5f7f7]"
            textColor="[#32343a]"
          />
          <Card
            title="Co2 배출량"
            value={co2Value ?? 0} // 기본값 0 설정
            unit="kg"
            bgColor="bg-[#CBF5CB]"
            textColor="[#0D9C36]"
          />
        </div>
      </div>
    </div>
  );
};

export default CarbonEmissionCard;
