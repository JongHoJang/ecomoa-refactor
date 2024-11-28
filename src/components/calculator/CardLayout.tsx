interface CardProps {
  title: string;
  value: number | string;
  unit: string;
  bgColor: string;
  textColor: string;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  unit,
  bgColor,
  textColor
}) => (
  <div
    className={`w-full min-w-[132px] min-h-[100px] md:w-[254px] md:h-[120px] ${bgColor} rounded-xl flex flex-col justify-center items-center`}
  >
    <div className="flex flex-col gap-[10px]">
      <div className="text-center text-[#000301] text-[12px] md:text-[16px] font-semibold">
        {title}
      </div>
      <div className="flex justify-center items-end gap-1">
        <div
          className={`text-${textColor} text-[20px] md:text-[34px] font-semibold leading-none`}
        >
          {value}
        </div>
        <div
          className={`text-${textColor} text-[12px] md:text-[22px] font-semibold leading-none`}
        >
          {unit}
        </div>
      </div>
    </div>
  </div>
);

export default Card;
