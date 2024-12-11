"use client";
import { useCallback, useRef } from "react";

import { useParams } from "next/navigation";
import { toJpeg } from "html-to-image";
import Image from "next/image";
import TipCardSection from "@/components/calculator/TipCardSection";
import CarbonEmissionCardList from "@/components/calculator/CarbonEmissionCardList";
import HeaderTitle from "@/components/layout/HeaderTitle";
import FormHeader from "@/components/shared/FormHeader";
import { useMyCarbonData, useUserCarbonData } from "@/hooks/useUserCarbonData";
import Loading from "@/components/calculator/Loading";
import EmissionUpAndDown from "@/components/calculator/EmissionUpAndDown";

const currentMonth = new Date().getMonth() + 1;

const ResultPage: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const year = Number(params.year);
  const month = Number(params.month);

  const {
    data: currentData,
    isLoading: isCurrentDataLoading,
    isError: isCurrentDataError
  } = useMyCarbonData(year, month);

  const {
    data: totalAvgData,
    isLoading: isUserDataLoading,
    isError: isUserDataError
  } = useUserCarbonData(year, month);

  const isLoading = isCurrentDataLoading || isUserDataLoading;
  const isError = isCurrentDataError || isUserDataError;

  // 이미지 다운로드 라이브러리 실행 (버튼 핸들러)
  const handleSaveImage = useCallback(() => {
    if (!sectionRef.current) return;

    toJpeg(sectionRef.current, {
      quality: 0.95,
      canvasWidth: sectionRef.current.offsetWidth + 100,
      canvasHeight: sectionRef.current.offsetHeight + 100,
      backgroundColor: "white"
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${year}-${month}-history.jpeg`;
        link.href = dataUrl;
        link.click();
        alert("저장이 완료되었습니다.");
      })
      .catch((error) => {
        console.error("Image saving failed:", error);
      });
  }, [year, month]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>에러입니다~</p>;
  }

  return (
    <>
      <div className="bg-[#F2F9F2] min-h-[1080px]">
        <div className="w-full min-w-[360px] max-w-[1200px] mx-auto pb-[80px]">
          <div className="px-[20px] md:px-[0px] mb-[80px]">
            {/* 페이지 header */}
            <div className="mb-[58px] md:mb-[80px]">
              <div className="pt-[76px] mb-[36px] md:mb-[48px] ">
                <FormHeader text="탄소 계산기 홈" location="/calculator" />
              </div>
              <HeaderTitle
                title="탄소 배출량 계산 결과표"
                description={`${year}년 ${month}월 이산화탄소 배출량이 얼마나 발생했을지 확인해봅시다`}
              />
            </div>
            <div>
              <div ref={sectionRef}>
                <EmissionUpAndDown
                  month={month}
                  currentMonth={currentMonth}
                  currentData={currentData || null}
                  totalAvgData={totalAvgData || null}
                />

                {/* 항목 별 탄소 배출량 영역 */}
                <div className="mb-[58px] md:mb-[140px]">
                  <p className="text-[14px] md:text-[24px] font-semibold mb-[32px] md:mb-[20px]">
                    항목 별 탄소 배출량
                  </p>
                  <div className="flex flex-wrap w-full md:w-[1200px] gap-[12px] md:gap-[30px]">
                    <CarbonEmissionCardList currentData={currentData || null} />
                  </div>
                </div>

                {/* 팁카드 영역 */}
                <div>
                  <div className="text-[14px] md:text-[24px] font-semibold mb-[32px]">
                    일상 속 에너지 절약법
                  </div>
                  <TipCardSection />
                </div>
              </div>
            </div>
          </div>

          {/* 이미지로  다운로드 버튼 */}
          <div className="flex justify-center">
            <button
              className="w-[320px] md:w-[360px] h-[60px] px-8 bg-[#0D9C36] text-white rounded-[85px] text-[18px] font-semibold border-none"
              onClick={handleSaveImage}
            >
              <div className="flex-row-center gap-2">
                <Image
                  src={"/calculate/download_btn.svg"}
                  alt={"tree-image"}
                  width={24}
                  height={24}
                />
                <div className="text-center">이미지로 저장</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPage;
