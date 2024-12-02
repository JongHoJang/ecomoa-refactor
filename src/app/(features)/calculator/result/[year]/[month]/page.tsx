"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { loadTotalUsersData, loadUserAndFetchData } from "@/hooks/monthlyData";
import { MonthlyData } from "@/types/calculate";
import ThisMonthChart from "../../../components/ThisMonthChart";
import SectionCard from "../../../components/SectionCard";
import { useParams } from "next/navigation";
import Link from "next/link";
import TipCard from "../../../components/TipCard";
import Loading from "../../../components/Loading";
import { toJpeg } from "html-to-image";
import Image from "next/image";

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

  // 최대 배출량 품목
  const highestCo2Value = Math.max(
    currentData?.electricity_co2 ?? 0,
    currentData?.gas_co2 ?? 0,
    currentData?.water_co2 ?? 0,
    currentData?.waste_co2 ?? 0,
    currentData?.car_co2 ?? 0
  );

  // 최저 배출량 품목
  const lowestCo2Value = Math.min(
    currentData?.electricity_co2 ?? 0,
    currentData?.gas_co2 ?? 0,
    currentData?.water_co2 ?? 0,
    currentData?.waste_co2 ?? 0,
    currentData?.car_co2 ?? 0
  );

  return (
    <>
      <div className="bg-[#F2F9F2] min-h-[1080px]">
        <div className="w-full min-w-[360px] max-w-[1200px] mx-auto pb-[80px]">
          <div className="px-[20px] md:px-[0px] mb-[80px]">
            <div className="pt-[36px] md:pt-[76px] mb-[58px] md:mb-[80px]">
              <Link href="/calculator">
                <div className="text-[16px]"> &lt; 탄소계산기 홈</div>
              </Link>
              <div className="w-full h-[1px] bg-gray-300 my-4 mb-[36px]"></div>
              <div className="text-[#32343a] text-[24px] md:text-[30px] font-semibold mb-[16px] md:mb-[28px]">
                탄소 배출량 계산 결과표
              </div>
              <div className=" text-[16px] md:text-[20px] font-normal text-[#00691E] leading-[1]">
                {year}년 {month}월 이산화탄소 배출량이 얼마나 발생했을지
                확인해봅시다
              </div>
            </div>
            <div>
              <div ref={sectionRef}>
                <div>
                  {/* 첫번째 section */}
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
                    <div className="w-[256px] h-[256px] md:w-[288px] md:h-[288px] flex justify-center items-center bg-white rounded-[24px]">
                      <ThisMonthChart
                        currentData={currentData}
                        totalAvgData={totalAvgData}
                      />
                    </div>
                  </div>
                </div>

                {/* 두번째 섹션 데이터 제공 */}
                <div className="mb-[58px] md:mb-[140px]">
                  <p className="text-[14px] md:text-[24px] font-semibold mb-[32px] md:mb-[20px]">
                    항목 별 탄소 배출량
                  </p>
                  <div className="flex flex-wrap w-full md:w-[1200px] gap-[12px] md:gap-[30px]">
                    <SectionCard
                      logo={"/calculate/electricity_color.svg"}
                      title={"전기"}
                      usageValue={currentData?.electricity_usage}
                      co2Value={currentData?.electricity_co2}
                      isHighest={
                        currentData?.electricity_co2 === highestCo2Value
                      }
                      isLowest={currentData?.electricity_co2 === lowestCo2Value}
                      unit="kwh"
                    />
                    <SectionCard
                      logo={"/calculate/gas_color.svg"}
                      title={"가스"}
                      usageValue={currentData?.gas_usage}
                      co2Value={currentData?.gas_co2}
                      isHighest={currentData?.gas_co2 === highestCo2Value}
                      isLowest={currentData?.gas_co2 === lowestCo2Value}
                      unit="m³"
                    />
                    <SectionCard
                      logo={"/calculate/water_color.svg"}
                      title={"수도"}
                      usageValue={currentData?.water_usage}
                      co2Value={currentData?.water_co2}
                      isHighest={currentData?.water_co2 === highestCo2Value}
                      isLowest={currentData?.water_co2 === lowestCo2Value}
                      unit="m³"
                    />
                    <SectionCard
                      logo={"/calculate/car_color.svg"}
                      title={"교통"}
                      usageValue={currentData?.car_usage}
                      co2Value={currentData?.car_co2}
                      isHighest={currentData?.car_co2 === highestCo2Value}
                      isLowest={currentData?.car_co2 === lowestCo2Value}
                      unit="km"
                    />
                    <SectionCard
                      logo={"/calculate/waste_color.svg"}
                      title={"폐기물"}
                      usageValue={currentData?.waste_volume}
                      co2Value={currentData?.waste_co2}
                      isHighest={currentData?.waste_co2 === highestCo2Value}
                      isLowest={currentData?.waste_co2 === lowestCo2Value}
                      unit="Kg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div>
                <div className="text-[14px] md:text-[24px] font-semibold mb-[32px]">
                  일상 속 에너지 절약법
                </div>
                <div className="flex flex-col gap-3 mb-[48px]">
                  <TipCard
                    tipLogo={"/calculate/electricity_white.svg"}
                    tipTitle={"LED 조명으로 교체하기"}
                    tipContent={
                      "LED는 기존 전구보다 전력 소모가 적어 전기 절약 효과가 큽니다."
                    }
                  />
                  <TipCard
                    tipLogo={"/calculate/gas_white.svg"}
                    tipTitle={"겨울철 실내 온도 낮추기"}
                    tipContent={
                      "난방 온도를 조금만 낮추고,담요나 양말을 활용해 따뜻함을 유지해 보세요."
                    }
                  />
                  <TipCard
                    tipLogo={"/calculate/water_white.svg"}
                    tipTitle={"세탁물 모아서 한 번에 세탁하기"}
                    tipContent={
                      "세탁기물을 한 번에 모아서 사용해 물과 전기를 함께 절약하세요."
                    }
                  />
                  <TipCard
                    tipLogo={"/calculate/car_white.svg"}
                    tipTitle={"출퇴근 카풀하기"}
                    tipContent={
                      "같은 방향으로 가는 사람들과 차를 함께 타면 연료와 교통비를 아낄 수 있어요."
                    }
                  />
                  <TipCard
                    tipLogo={"/calculate/waste_white.svg"}
                    tipTitle={"텀블러와 에코백 사용하기"}
                    tipContent={
                      "일회용 컵과 비닐봉투 대신 텀블러와 에코백을 사용해 폐기물을 줄여보세요."
                    }
                  />
                </div>
              </div>
            </div>
          </div>
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
