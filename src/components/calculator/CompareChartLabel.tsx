import React from "react";

const CompareChartLabel = () => {
  return (
    <div className="flex flex-row absolute top-[20px] right-[20px] gap-4">
      <div className="flex flex-row gap-1 items-center">
        <div className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] rounded-full bg-[#D5D7DD]" />
        <div>평균 배출량</div>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <div className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] rounded-full bg-[#FF7D6F]" />
        <div>나의 총 배출량</div>
      </div>
    </div>
  );
};

export default CompareChartLabel;
