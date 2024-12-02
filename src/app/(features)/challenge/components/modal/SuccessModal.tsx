import Image from "next/image";
import { CHALLENGES } from "@/utlis/challenge/challenges";

interface SuccessModalProps {
  onClose: () => void;
  selectedChallenges: string[];
}

const SuccessModal = ({ onClose, selectedChallenges }: SuccessModalProps) => {
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
          className="text-gray-600 md:w-6 md:h-6"
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <figure className="block w-full bg-[#CBF5CB]">
        <Image
          src="/images/complete.png"
          alt="챌린지 완료 이미지"
          width={615}
          height={422}
          className="rounded-xl w-full h-[340px] md:h-auto hidden md:block"
          priority
        />
        <Image
          src="/images/mobileCompleted.png"
          alt="챌린지 완료 이미지"
          width={320}
          height={340}
          className="rounded-xl w-full h-[340px] md:h-auto md:hidden"
          priority
        />
      </figure>

      <div className="flex-col-center md:gap-[10px] mt-[54px] md:mt-[40px]">
        <h2 className="text-lg md:text-[24px] font-semibold text-center">
          챌린지 인증 완료했어요!
        </h2>
        <p className="text-lg md:text-[24px] font-semibold text-center">
          총{" "}
          <span className="text-[#0D9C36]">
            {selectedChallenges.length * 100}
          </span>
          P를 모았어요!
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap gap-2 justify-center items-center mt-4 w-full mb-[36px] md:mb-0 p-4 md:p-6">
        {CHALLENGES.filter((c) => selectedChallenges.includes(c.id)).map(
          (ch) => (
            <div
              key={ch.id}
              className="flex flex-row gap-[4px] rounded-full bg-[#0D9C36] px-[16px] py-3 md:p-2 text-[14px] md:text-sm text-white shadow-sm whitespace-nowrap"
              title={ch.label}
            >
              <p>{ch.label}</p>
              <p>{ch.label2}</p>
              <p>100P</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
