import { LevelInfo } from "@/types/challengesType";

interface LevelGaugeProps {
  levelInfo: LevelInfo;
}
const LevelGauge = ({ levelInfo }: LevelGaugeProps) => {
  if (!levelInfo) return;
  return (
    <section className="space-y-2 w-full flex-col-center ml-[20px] md:ml-0">
      {/* 레벨 */}
      <div className="w-full flex items-center justify-start gap-[8px] md:gap-[10px] px-5">
        <div className="border-[1px] border-[#00320F] h-[32px] bg-[#FFF] rounded-[16px] flex items-center justify-center p-[15px_16px]">
          <p className="text-[12px] md:text-[14px] font-[500] leading-[-0.14px] text-[#00320F]">
            LV.{levelInfo?.level} {levelInfo?.name}
          </p>
        </div>

        <p className="text-[#00691E] text-[12px] md:text-[14px] font-[500] leading-[-0.14px]">
          레벨업까지 {levelInfo.pointsToNextLevel}P 남았어요
        </p>
      </div>
      {/* 게이지 */}
      <div className="w-full flex flex-row gap-3 items-center justify-start pt-[12px] pb-[32px] px-5 md:py-3">
        <div className="rounded-[12px] w-[152px] md:w-[400px] h-[16px] bg-transparent border border-[##A1A7B4]">
          <div
            className="rounded-[12px] w-full h-4 transition-all duration-300"
            style={{
              width: `${
                (levelInfo.currentPoints / levelInfo.maxPoints) * 100
              }%`,
              backgroundColor: `${levelInfo.exp}`
            }}
          />
        </div>
        <p className="text-[12px] md:text-[16px] font-normal text-right">
          <span className="font-[600]">{levelInfo.currentPoints}</span>/
          <span className="text-[#525660]">{levelInfo.maxPoints}P</span>
        </p>
      </div>
    </section>
  );
};

export default LevelGauge;
