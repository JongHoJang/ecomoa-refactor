import { ImageSize, ServiceLevelsColors } from "@/utlis/home/service";
import Image from "next/image";

interface Props {
  card: Card;
  className: string;
}

interface Card {
  level: number;
  title: string;
  imageSrc: string;
  description: string;
  imageSize: ImageSize;
}

const ServiceCharacterCard = ({ card, className = "" }: Props) => {
  return (
    <div
      className={`w-[151px] md:w-full h-[153px] md:h-auto flex flex-col items-center justify-center ${className}`}
    >
      <p className="mb-[12px] md:mb-[23px] text-[#000301] text-[11px] md:text-[20px] font-[700] leading-[16px] md:leading-[38px]">
        LV.{card.level} {card.title}
      </p>
      <div className="flex flex-col justify-center w-[151px] md:w-[276px] h-[280px] border border-[#D5D7DD] rounded-[15px] md:rounded-[28px]">
        <div
          className={`flex justify-center w-full h-[199px] md:h-[204px] rounded-t-[28px] ${
            ServiceLevelsColors[card.level]
          }`}
        >
          <Image
            src={card.imageSrc}
            alt={card.title}
            width={card.imageSize.mobile.width}
            height={card.imageSize.mobile.height}
          />
        </div>
        <div className="h-[42px] md:h-[76px] flex justify-center items-center text-[#525660] text-[9px] md:text-[16px] font-[600] leading-[24px]">
          <p>{card.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCharacterCard;
