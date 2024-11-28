import Image from "next/image";
import Link from "next/link";
import React from "react";

const Main = () => {
  return (
    <div className="bg-[#F2F9F2] min-h-[1080px]">
      <div className="w-full min-w-[360px] max-w-[1200px] mx-auto px-[20px] md:px-0 pb-[80px]">
        <div className="pt-[36px] md:pt-[76px] mb-[58px]  md:mb-[100px]">
          <div className="flex flex-col w-full md:w-full leading-[1] md:leading-[80%] gap-[20px] md:gap-[40px]">
            <div className="flex flex-col gap-2 md:gap-[40px]">
              <div className="text-black text-[24px] md:text-[40px] font-bold">
                이번 달 탄소 배출량을 계산해보고,
              </div>
              <div className="text-black text-[24px] md:text-[40px] font-bold">
                탄소 절감에 함께 노력해봐요
              </div>
            </div>
            <div className="text-[16px] md:text-[20px] font-normal text-[#00691E]">
              매월 발생하는 이산화탄소 발생량을 계산해 평소 나의 에너지 사용량을
              비교 & 분석할 수 있어요
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[20px]">
          {/* 탄소 계산하기 버튼 영역 */}
          <div className="relative flex flex-col md:flex-row w-full h-[434px] md:h-[268px] bg-white rounded-2xl border border-[#dcecdc] md:justify-between">
            <div className="mt-[28px] ml-[18px] md:mt-[60px] md:ml-[60px]">
              <div className="mb-[48px] md:mb-[53px]">
                <div className="text-[24px] md:text-[32px] font-semibold mb-[18px] md:mb-[24px]">
                  탄소 배출량 계산하기
                </div>
                <div className="text-[12px] md:text-[20px]">
                  전기 / 수도 / 가스 / 교통 / 폐기물에 대한 사용량을 입력하세요
                </div>
              </div>
              {/* 버튼 */}
              <div className="w-[240px] h-[60px] px-8 bg-[#0d9c36] rounded-[85px] text-[white] text-[20px] font-semibold hover:bg-[#00320F]">
                <Link href="/calculator/calculate">
                  <div className="flex flex-col h-full justify-center items-center whitespace-nowrap">
                    탄소 계산하기
                  </div>
                </Link>
              </div>
            </div>

            <div className="w-[260px] md:w-[344px] md:h-[268px] absolute bottom-0 right-0 md:relative">
              <Image
                src={"/calculate/calculate_btn_img.svg"}
                alt={"tree-image"}
                width={344}
                height={268}
              />
            </div>
          </div>

          {/* 히스토리 버튼 영역 */}
          <div className="relative flex flex-col md:flex-row w-full h-[434px] md:h-[268px] bg-white rounded-2xl border border-[#dcecdc] md:justify-between">
            <div className="mt-[28px] ml-[18px] md:mt-[60px] md:ml-[60px]">
              <div className="mb-[48px] md:mb-[53px]">
                <div className="text-[24px] md:text-[32px] font-semibold mb-[18px] md:mb-[24px]">
                  나의 탄소 배출량 히스토리
                </div>
                <div className="text-[12px] md:text-[20px]">
                  이전에 계산한 탄소 배출량에 대한 종합적인 통계를 확인하세요
                </div>
              </div>
              {/* 버튼 */}
              <div className="w-[240px] h-[60px] px-8 bg-[#0d9c36] rounded-[85px] text-[white] text-[20px] font-semibold hover:bg-[#00320F]">
                <Link href="/calculator/result-history-main">
                  <div className="flex flex-col h-full justify-center items-center whitespace-nowrap">
                    히스토리 확인하기
                  </div>
                </Link>
              </div>
            </div>

            <div className="w-[260px] md:w-[344px] md:h-[268px] absolute bottom-0 right-0 md:relative">
              <Image
                src={"/calculate/calculate_history_btn_img.svg"}
                alt={"tree-image"}
                width={344}
                height={268}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
