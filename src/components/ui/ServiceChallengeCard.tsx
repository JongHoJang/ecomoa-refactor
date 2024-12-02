import Image from "next/image";

interface Props {
  imageSrc: string;
  titleLines: string[];
}

const ServiceChallengeCard = ({ imageSrc, titleLines }: Props) => {
  return (
    <div className="flex flex-col justify-center gap-7 items-center w-[191px] bg-white h-[191px] rounded-2xl">
      <Image
        src={imageSrc}
        alt={`${titleLines.join(" ")} 아이콘`}
        width={30}
        height={30}
      />
      <div className="font-bold flex flex-col text-center gap-[10px]">
        {titleLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
};

export default ServiceChallengeCard;
