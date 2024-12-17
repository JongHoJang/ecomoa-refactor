"use client";
import { LevelInfo } from "@/types/challengesType";
import Image from "next/image";
import LevelSectionSkeleton from "./LevelSectionSkeleton";
import { useModalStore } from "@/zustand/modalStore";
import { useEffect, useRef } from "react";
import { LEVEL_CONFIG } from "@/utlis/challenge/challenges";
import LevelUpModal from "../modal/LevelUpModal";

interface LevelSectionProps {
  levelInfo: LevelInfo | null;
  isLoading: boolean;
}

const LevelSection = ({ levelInfo, isLoading }: LevelSectionProps) => {
  const { openModal, closeModal } = useModalStore();
  const prevPoints = useRef(0);

  useEffect(() => {
    if (!levelInfo) return;

    Object.entries(LEVEL_CONFIG).forEach(([level, config]) => {
      if (
        levelInfo.totalPoints >= config.min &&
        prevPoints.current < config.min &&
        Number(level) > 1
      ) {
        const hasShownModal = localStorage.getItem(
          `level_${level}_modal_shown`
        );

        if (!hasShownModal) {
          openModal({
            type: "custom",
            content: (
              <LevelUpModal
                name={config.name}
                minPoints={config.min}
                levelUpImg={config.levelUpImg}
                onClose={closeModal}
              />
            )
          });

          localStorage.setItem(`level_${level}_modal_shown`, "true");
        }
      }
    });

    prevPoints.current = levelInfo.totalPoints;
  }, [levelInfo, openModal, closeModal]);

  if (isLoading || !levelInfo) {
    return <LevelSectionSkeleton />;
  }
  return (
    <section className="flex flex-col gap-4 mt-[78px] lg:mt-0 w-full lg:w-auto">
      <div className="flex flex-col w-full lg:w-[585px] h-[124px] lg:h-[319px] justify-end">
        <figure
          className="relative flex h-[180px] lg:h-[228px] w-full border rounded-3xl"
          style={{ backgroundColor: levelInfo.bg }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            {levelInfo.name === "씨앗" || levelInfo.name === "클로비" ? (
              <Image
                src={levelInfo.image}
                alt={levelInfo.name}
                width={185}
                height={220}
                className="w-[160px] h-[175px] lg:w-[235px] lg:h-[280px]"
              />
            ) : (
              <Image
                src={levelInfo.image}
                alt={levelInfo.name}
                width={205}
                height={220}
                className="w-[210px] h-[175px] lg:w-[285px] lg:h-[280px]"
              />
            )}
          </div>
        </figure>
      </div>
      <div className="flex flex-col gap-3 w-[100%] mx-auto lg:mx-0 lg:w-[585px]">
        <div className="flex flex-row gap-[8px] items-center">
          <p
            className="w-auto h-[32px] text-m font-semibold text-[14px] rounded-2xl text-center border-2 p-2"
            style={{ borderColor: levelInfo.exp }}
          >
            LV.{levelInfo.level} {levelInfo.name}
          </p>
          <p className="text-sm text-gray-600">
            레벨업까지 {levelInfo.pointsToNextLevel}P 남았어요
          </p>
        </div>
        <div className="flex w-full lg:w-[585px] flex-row items-center gap-3">
          <div className="w-full lg:w-[476px] h-3 lg:h-4 bg-gray-200 text-left rounded-full">
            <div
              className="rounded-full h-full transition-all duration-300"
              style={{
                backgroundColor: levelInfo.exp,
                width: `${
                  (levelInfo.currentPoints / levelInfo.maxPoints) * 100
                }%`
              }}
            />
          </div>
          <p className="text-xs lg:text-[14px] text-right whitespace-nowrap">
            {levelInfo.currentPoints}/{levelInfo.maxPoints}P
          </p>
        </div>
      </div>
    </section>
  );
};

export default LevelSection;
