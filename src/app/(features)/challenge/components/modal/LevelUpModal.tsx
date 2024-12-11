import Image from "next/image";

interface LevelUpModalProps {
  name: string;
  minPoints: number;
  levelUpImg: string;
  onClose: () => void;
}

const LevelUpModal = ({
  name,
  minPoints,
  levelUpImg,
  onClose
}: LevelUpModalProps) => {
  return (
    <div className="flex flex-col items-center relative w-full md:w-[585px] min-h-[300px]">
      <button
        onClick={onClose}
        className="absolute top-[24px] md:top-4 right-[24px] md:right-4 border-none rounded-full"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-300 md:w-6 md:h-6"
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <figure className="block w-full bg-gray-800">
        <Image
          src={levelUpImg}
          alt={`${name} 레벨업 이미지`}
          width={615}
          height={422}
          className="w-full h-[340px] md:h-auto"
          priority
        />
      </figure>

      <div className="flex-col-center md:gap-[10px] my-[80px] md:my-[100px]">
        <h2 className="text-lg md:text-[24px] font-semibold text-center">
          {minPoints}P 달성 축하합니다!
        </h2>
        <p className="text-lg md:text-[24px] font-semibold text-center">
          <span className="text-[#0D9C36]">{name}</span> 레벨로 성장했어요
        </p>
      </div>
    </div>
  );
};

export default LevelUpModal;
