import Image from "next/image";
import React from "react";

export interface TipCardProps {
  tipLogo: string;
  tipTitle: string;
  tipContent: string;
}

const TipCard: React.FC<TipCardProps> = ({ tipLogo, tipTitle, tipContent }) => {
  return (
    <div>
      <div className="flex flex-row w-full min-w-[320px] md:max-w-[1200px] h-[92px] md:h-[120px] px-6 py-[28px] md:py-[40px] bg-[#e8f3e8] rounded-xl gap-[12px] md:gap-[24px] items-center">
        <Image
          src={tipLogo}
          alt={tipLogo}
          width={56}
          height={56}
          className="w-[36px] h-[36px] md:w-[56px] md:h-[56px]"
        />
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="text-black text-[16px] md:text-[20px] font-semibold">
            {tipTitle}
          </div>
          <div className=" text-[#777777] text-[12px] md:text-[16px] font-normal ">
            {tipContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipCard;
