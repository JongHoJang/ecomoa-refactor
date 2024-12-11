import { MonthlyData } from "@/types/calculate";
import Image from "next/image";

interface TreeCalculationCardProps {
  myAllAvgData: number;
  myAllData: MonthlyData[] | null; // myAllData도 null일 수 있음
  userAvgData: number | null;
}

const TreeCalculationCard: React.FC<TreeCalculationCardProps> = ({
  myAllAvgData,
  myAllData,
  userAvgData
}) => {
  return (
    <div className="flex flex-col md:flex-row px] w-full h-[390px] md:h-[300px] rounded-[16px] justify-between items-center bg-[#00320F] px-[32px] py-[40px] md:px-[80px] mb-[58px] md:mb-[80px]">
      <div className="flex-row-center gap-8">
        <div className="flex flex-col">
          <p className="text-white text-[16px] md:text-[20px] font-bold mb-[24px]">
            지금까지 심은 나무
          </p>
          <div className="text-[#FFD64E] text-[36px] font-semibold mb-[28px] md:mb-[32px]">
            {myAllAvgData > 0
              ? (() => {
                  const totalCarbonEmissions =
                    myAllData?.reduce(
                      (total, item) => total + (item.carbon_emissions || 0),
                      0
                    ) || 0;

                  const treeCount =
                    (totalCarbonEmissions - (Number(userAvgData) || 0)) / 22;

                  return treeCount > 0
                    ? `${treeCount.toFixed(2)} 그루`
                    : "0 그루";
                })()
              : "0 그루"}
          </div>
          <p className="md:w-[450px] text-white text-[16px] mb-2 leading-[1.2]">
            평균 사용자보다 적게 배출한 탄소량을 나무의 연간 탄소 흡수량과
            비교해 나무로 환산해 보았어요!
          </p>
        </div>
      </div>
      <Image
        src={"/calculate/treeImg.svg"}
        alt={"tree-image"}
        width={400}
        height={216}
      />
    </div>
  );
};

export default TreeCalculationCard;
