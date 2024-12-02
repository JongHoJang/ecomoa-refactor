import React from "react";
import TipCard from "./TipCard";

const TipCardSection = () => {
  return (
    <div>
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
  );
};

export default TipCardSection;
