import Image from "next/image";
import { useModalStore } from "@/zustand/modalStore";

interface SaveStoreModalProps {
  onViewSaved?: () => void;
}

const SaveStoreModal = ({ onViewSaved }: SaveStoreModalProps) => {
  const { closeModal } = useModalStore();

  return (
    <div className="flex flex-col items-center relative w-full md:w-[585px] min-h-[300px]">
      <button
        onClick={closeModal}
        className="absolute top-2 md:top-4 right-2 md:right-4 p-2 border-none rounded-full"
      >
        <svg
          width="20"
          height="20"
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
          src="/images/save.png"
          alt="챌린지 완료 이미지"
          width={585}
          height={340}
          className="rounded-xl w-full h-[340px] md:h-auto hidden md:block"
          priority
        />
        <Image
          src="/images/mobileSaved.png"
          alt="챌린지 완료 이미지"
          width={585}
          height={340}
          className="rounded-xl w-full h-[340px] md:h-auto md:hidden"
          priority
        />
      </figure>

      <div className="flex-col-center gap-[28px] mt-[44px] md:mt-[54px]">
        <h2 className="text-[22px] md:text-[24px] font-semibold">
          저장했어요!
        </h2>
        <div className="p-2 md:p-3 rounded bg-gray-200 text-xs md:text-[14px]">
          <p>
            <span className="text-[#00691E]">위치</span> 친환경 가게 Map {">"}{" "}
            저장한 가게
          </p>
        </div>
      </div>

      <div className="w-full mt-[20px] md:mt-0 py-6 px-8 md:px-9">
        <button
          onClick={onViewSaved}
          className="font-semibold text-[16px] text-white font-bold px-4 py-[23px] md:p-6 w-full rounded-full bg-[#0D9C36] mb-4 md:mb-[32px] hover:bg-[#0B8A2E] transition-colors"
        >
          저장한 가게 보러가기
        </button>
      </div>
    </div>
  );
};

export default SaveStoreModal;
