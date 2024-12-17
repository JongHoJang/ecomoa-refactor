"use client";
import { StoreWithExtra } from "@/types/map";
import { useModalStore } from "@/zustand/modalStore";
import React, { Dispatch, SetStateAction } from "react";
import SaveStoreModal from "../../modal/SavaStoreModal";
import { useBookmark } from "@/hooks/useBookmark";
import Image from "next/image";
import { userStore } from "@/zustand/userStore";

interface Props {
  store: StoreWithExtra;
  selectedStoreId: string | null;
  onClick: (store: StoreWithExtra) => void;
  setActiveTab: Dispatch<SetStateAction<string>>;
  setSelectedStoreId: Dispatch<SetStateAction<string | null>>;
}

const StoreCard = ({
  store,
  selectedStoreId,
  onClick,
  setActiveTab,
  setSelectedStoreId
}: Props) => {
  const { openModal, closeModal } = useModalStore();
  const { isBookmarked, handleToggleBookmark } = useBookmark(store.store_id);
  const { user } = userStore();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      const scrollableDiv = document.querySelector(".overflow-y-auto");
      if (scrollableDiv) {
        scrollableDiv.scrollTo(0, 0);
      }
    }
  };

  const handleSaveStore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      user.accessToken === "" ||
      user.accessToken === null ||
      user.accessToken === undefined
    )
      return alert("로그인된 유저만 가능합니다.");
    if (!isBookmarked) {
      try {
        await handleToggleBookmark();

        openModal({
          type: "custom",
          content: (
            <SaveStoreModal
              onViewSaved={() => {
                closeModal();
                setActiveTab("saved");
                scrollToTop();
                setSelectedStoreId(store.store_id);
              }}
            />
          )
        });
      } catch (error) {
        console.error("저장 실패:", error);
        alert("저장에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      await handleToggleBookmark();
    }
  };

  return (
    <div
      key={store.store_id}
      onClick={() => onClick(store)}
      className={`relative flex flex-col justify-between p-8 md:w-[356px] h-[223px] border rounded-lg cursor-pointer transition-colors ${
        selectedStoreId === store.store_id
          ? "bg-[#CBF5CB] border-[#0D9C36]"
          : "hover:bg-gray-50 bg-white"
      }`}
    >
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800 mb-[10px]">
            {store.store_name}
          </h3>
        </div>
        <p className="text-sm text-gray-600">{store.road_address}</p>
        <p className="text-sm text-gray-500 truncate">
          {store.operating_hours}
        </p>
        {store.distance !== undefined && (
          <p className="text-sm text-gray-500">
            {store.distance < 1
              ? `${(store.distance * 1000).toFixed(0)}m`
              : `${store.distance.toFixed(1)}km`}
          </p>
        )}
      </div>
      <div
        className={`flex flex-row gap-[8px]
        
      ${
        store.bookmarkCount !== undefined && store.bookmarkCount > 0
          ? "justify-between"
          : "justify-end"
      }`}
      >
        {store.bookmarkCount !== undefined && store.bookmarkCount > 0 && (
          <div className="flex items-center gap-1 text-[14px]">
            {isBookmarked ? (
              <Image
                src="/images/bookmarked.png"
                alt="북마크이미지"
                width={14}
                height={14}
              />
            ) : (
              <Image
                src="/images/bookmark.png"
                alt="북마크이미지"
                width={14}
                height={14}
              />
            )}
            <span className="text-[#0D9C36] mt-[1px]">
              {store.bookmarkCount}
            </span>
          </div>
        )}
        <button
          className={`w-[80px] h-[32px] text-white ${
            isBookmarked ? "bg-[#03551a]" : "bg-[#0D9C36]"
          } rounded-[32px] text-[12px] flex justify-center items-center`}
          onClick={handleSaveStore}
        >
          {isBookmarked ? "저장됨" : "저장하기"}
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
