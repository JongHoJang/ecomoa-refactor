import Image from "next/image";
import React from "react";

export interface TipCardProps {
  tipLogo: string;
  tipTitle: string;
  tipContent: string;
}

const HistoryCard: React.FC<TipCardProps> = ({
  tipLogo,
  tipTitle,
  tipContent
}) => {
  return (
    <div>
      <div className="w-full h-[120px] px-6 py-4 bg-[#e8f3e8] rounded-xl justify-start items-center gap-6 inline-flex">
        <Image src={tipLogo} alt={tipLogo} width={56} height={56} />

        <div className="w-[497px] flex-col justify-start items-start gap-4 inline-flex">
          <div className="self-stretch text-black text-[20px] font-semibold">
            {tipTitle}
          </div>
          <div className="self-stretch text-[#777777] text-[16px] font-normal ">
            {tipContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
