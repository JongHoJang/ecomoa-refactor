"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadTotalUsersData, loadUserAndFetchData } from "@/hooks/monthlyData";
import { MonthlyData } from "@/types/calculate";
import { useParams } from "next/navigation";
import { toJpeg } from "html-to-image";
import Image from "next/image";
import TipCardSection from "@/components/calculator/TipCardSection";
import CarbonEmissionCardList from "@/components/calculator/CarbonEmissionCardList";
import Loading from "@/components/calculator/Loading";
import ThisMonthChart from "@/components/calculator/ThisMonthChart";
import HeaderTitle from "@/components/layout/HeaderTitle";
import FormHeader from "@/components/shared/FormHeader";

const currentMonth = new Date().getMonth() + 1;
const MIN_LOADING_TIME = 1000; // 최소 로딩 시간

const ResultPage: React.FC = () => {
  const [currentData, setCurrentData] = useState<MonthlyData | null>(null);
  const [totalAvgData, setTotalAvgData] = useState<MonthlyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null); // 특정 섹션을 감싸는 ref

  // useParams > URL 이동
  const params = useParams();
  const year = params.year;
  const month = params.month;

  // 이미지 다운로드 라이브러리 실행 (버튼 핸들러)
  const handleSaveImage = useCallback(() => {
    if (!sectionRef.current) return;

    // 캡처 영역의 크기 및 배경색 확장
    toJpeg(sectionRef.current, {
      quality: 0.95,
      canvasWidth: sectionRef.current.offsetWidth + 100, // 기존 너비 + 50px * 2
      canvasHeight: sectionRef.current.offsetHeight + 100, // 기존 높이 + 50px * 2
      backgroundColor: "white" // 배경 흰색 설정
    })
      .then((dataUrl) => {
        // 다운로드 링크 생성 및 실행
        const link = document.createElement("a");
        link.download = `${year}-${month}-history.jpeg`;
        link.href = dataUrl;
        link.click();
        alert("저장이 완료되었습니다.");
      })
      .catch((error) => {
        console.error("Image saving failed:", error);
      });
  }, []);

  // 데이터 패칭
  useEffect(() => {
    if (year && month) {
      const fetchStartTime = Date.now();

      Promise.all([
        loadUserAndFetchData(Number(year), Number(month), setCurrentData),
        loadTotalUsersData(Number(year), Number(month), setTotalAvgData)
      ])
        .then(() => {
          const timeElapsed = Date.now() - fetchStartTime;
          const remainingTime = MIN_LOADING_TIME - timeElapsed;

          if (remainingTime > 0) {
            setTimeout(() => setIsLoading(false), remainingTime);
          } else {
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error("데이터 로드 실패:", error);
          setIsLoading(false);
        });
    }
  }, [year, month]);

  if (isLoading) {
    return <Loading />;
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
                <div>
                  {/* 해당 월 탄소 배출량 제공 영역 */}
                  <div className="flex flex-col md:flex-row min-w-[320px] h-[484px] w-full md:h-[400px] rounded-[16px] md:justify-between items-center bg-[#00320F] pt-[40px] md:pt-0 px-[32px] mb-[58px] md:mb-[140px] md:px-[80px]">
                    <div className="flex">
                      <div className="flex flex-col">
                        <div className="text-[24px] md:text-[36px] font-bold text-white mb-[28px] md:mb-[36px]">
                          {month !== null && currentMonth !== null
                            ? Number(month) === currentMonth
                              ? "이번 달"
                              : `${month}월`
                            : ""}{" "}
                          총 탄소 배출량은
                        </div>
                        <div className="text-[#FFD64E] text-[36px] md:text-[48px] font-semibold mb-[30px] md:mb-[40px]">
                          {currentData?.carbon_emissions}kg
                        </div>
                        <div className="text-[14px] md:text-[16px] text-white mb-[48px] md:mb-0">
                          탄소 배출량이 평균 보다{" "}
                          {totalAvgData && currentData ? (
                            currentData.carbon_emissions <
                            totalAvgData.carbon_emissions ? (
                              <>
                                {(
                                  100 -
                                  (currentData.carbon_emissions /
                                    totalAvgData.carbon_emissions) *
                                    100
                                ).toFixed(2)}{" "}
                                % 낮아요!
                              </>
                            ) : (
                              <>
                                {(
                                  (currentData.carbon_emissions /
                                    totalAvgData.carbon_emissions) *
                                    100 -
                                  100
                                ).toFixed(2)}{" "}
                                % 높아요!
                              </>
                            )
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {/* 차트 영역 */}
                    <div className="w-[256px] h-[256px] md:w-[288px] md:h-[288px] flex justify-center items-center bg-white rounded-[24px]">
                      <ThisMonthChart
                        currentData={currentData}
                        totalAvgData={totalAvgData}
                      />
                    </div>
                  </div>
                </div>

                {/* 항목 별 탄소 배출량 영역 */}
                <div className="mb-[58px] md:mb-[140px]">
                  <p className="text-[14px] md:text-[24px] font-semibold mb-[32px] md:mb-[20px]">
                    항목 별 탄소 배출량
                  </p>
                  <div className="flex flex-wrap w-full md:w-[1200px] gap-[12px] md:gap-[30px]">
                    <CarbonEmissionCardList currentData={currentData} />
                  </div>
                </div>
              </div>
            </div>

            {/* 팁카드 영역 */}
            <div>
              <div>
                <div className="text-[14px] md:text-[24px] font-semibold mb-[32px]">
                  일상 속 에너지 절약법
                </div>
                <TipCardSection />
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
