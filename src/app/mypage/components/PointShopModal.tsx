// PointShopModal.tsx
"use client";

import { useModalStore } from "@/zustand/modalStore";

const PointShopModal = () => {
  const { openModal } = useModalStore();

  const handleClickPoint = () => {
    openModal({
      type: "alert",
      content: <>추후 업데이트 예정입니다</>,
      autoClose: 2000
    });
  };

  return (
    <div className="flex justify-center gap-3">
      <div className="flex flex-col md:flex-row gap-[12px]">
        <button
          onClick={handleClickPoint}
          className="flex-col-center text-[#FFFFFF] text-[18px] font-[500] leading-[0-18px] border-none w-[255px] h-[60px] p-[24px_16px] bg-[#00320F] rounded-[40px]"
        >
          포인트 적립, 사용내역
        </button>
        <button
          onClick={handleClickPoint}
          className="flex-col-center text-[#FFFFFF] text-[18px] font-[500] leading-[0-18px] border-none w-[255px] h-[60px] p-[24px_16px] bg-[#00320F] rounded-[40px]"
        >
          포인트 교환 샵
        </button>
      </div>
    </div>
  );
};

export default PointShopModal;
