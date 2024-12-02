import { MonthlyData } from "@/types/calculate";
import Image from "next/image";

interface HistoryCompareCardProps {
  myAllData: MonthlyData[] | null; // null 가능
  userAllData: MonthlyData[] | null; // null 가능
}

const HistoryCompareCard: React.FC<HistoryCompareCardProps> = ({
  myAllData,
  userAllData
}) => {
  const thisMonthMyAvg = myAllData?.[1]?.carbon_emissions ?? 0; // 기본값 0 설정
  const LastMonthMyAvg = myAllData?.[0]?.carbon_emissions ?? 0; // 저번달 내 평균
  const thisMonthUserAvg = userAllData?.[1]?.carbon_emissions ?? 0; // 이번달 유저 평균

  let comment = " ";

  if (thisMonthMyAvg > LastMonthMyAvg && thisMonthMyAvg > thisMonthUserAvg) {
    comment =
      "평균 사이에서도 탄소 배출량이 많은 편이어서 앞으로의 세심한 노력이 더 필요해 보여요.";
  } else if (
    thisMonthMyAvg > LastMonthMyAvg &&
    thisMonthMyAvg < thisMonthUserAvg
  ) {
    comment =
      "현재 평균에 비해 탄소 배출량이 적게 나왔지만 다음달엔 다시 노력해서 배출량을 줄여보아요! ";
  } else if (
    thisMonthMyAvg < LastMonthMyAvg &&
    thisMonthMyAvg > thisMonthUserAvg
  ) {
    comment =
      "그래도 아직 평균에 비해 조금 많은 탄소를 배출하고 있어요.다음달에는 더 노력해보아요.";
  } else if (
    thisMonthMyAvg < LastMonthMyAvg &&
    thisMonthMyAvg < thisMonthUserAvg
  ) {
    comment =
      "또한 평균 사이에서도 탄소 배출량이 적게 나왔군요! 지구와 환경을 위해 앞으로도 지속해주세요.";
  } else if (
    thisMonthMyAvg === LastMonthMyAvg &&
    thisMonthUserAvg < thisMonthMyAvg
  ) {
    comment =
      "그래도 아직 평균에 비해 조금 많은 탄소를 배출하고 있어요.다음달에는 더 노력해보아요.";
  } else if (
    thisMonthMyAvg === LastMonthMyAvg &&
    thisMonthUserAvg > thisMonthMyAvg
  ) {
    comment =
      "평균 사이에서도 탄소 배출량이 적게 나왔군요! 지구와 환경을 위해 앞으로도 지속해주세요.";
  } else if (thisMonthMyAvg === undefined || LastMonthMyAvg === undefined) {
    comment =
      "이번 달이나 지난 달의 데이터가 없습니다. 계산기를 통해 데이터를 추가해주세요.";
  } else {
    comment = "데이터에 오류가 있습니다";
  }

  return (
    <>
      <div className="flex w-full min-w-[320px] md:w-full h-[120px] md:h-[200px] bg-white border border-[#D7E8D7] rounded-[20px] overflow-hidden mt-[24px] justify-between relative">
        <div className="flex flex-col gap-2 md:py-[78px] p-[23px] md:p-[36px] md:pl-[80px] text-[12px] md:text-[20px]">
          <div className="flex md:flex-row">
            {/* 데이터가 없을 경우 처리 */}
            {thisMonthMyAvg === undefined ||
            LastMonthMyAvg === undefined ||
            !myAllData ||
            !userAllData ||
            thisMonthMyAvg === 0 ||
            LastMonthMyAvg === 0 ? (
              <div>
                이번 달이나 지난 달의 데이터가 없습니다. 데이터를 확인해 주세요.
              </div>
            ) : (
              // 데이터가 있을 경우
              <div>
                {/* 이번 달이 지난 달보다 많을 경우 */}
                {thisMonthMyAvg > LastMonthMyAvg && (
                  <div>
                    <div className="flex flex-row mb-[10px] items-center">
                      <div className="">이번 달 탄소 배출량은 지난달보다</div>
                      <div className="ml-1">
                        {(
                          (thisMonthMyAvg / LastMonthMyAvg) * 100 -
                          100
                        ).toFixed(2)}
                        %
                      </div>
                      <div className="ml-1">증가했어요!</div>
                    </div>
                    <div className="leading-relaxed">{comment}</div>
                  </div>
                )}

                {/* 이번 달이 지난 달보다 적을 경우 */}
                {thisMonthMyAvg < LastMonthMyAvg && (
                  <div>
                    <div className="flex mb-[10px] items-center">
                      <div>이번 달 탄소 배출량은 지난달보다 </div>
                      <div className="ml-1">
                        {(
                          (LastMonthMyAvg / thisMonthMyAvg) * 100 -
                          100
                        ).toFixed(2)}
                        %
                      </div>
                      <div className="ml-1">감소했어요!</div>
                    </div>
                    <div className="leading-relaxed">{comment}</div>
                  </div>
                )}

                {/* 이번 달과 지난 달이 동일할 경우 */}
                {thisMonthMyAvg === LastMonthMyAvg && (
                  <div className="flex flex-col">
                    <div className="mb-[10px]">
                      이번 달 탄소 배출량은 지난달과 동일한 양을 배출했어요!
                    </div>
                    <div className="leading-relaxed">{comment}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute md:relative w-[66px] md:w-[230px] mt-[65px] md:mt-[20px] right-[10px] overflow-hidden">
          <Image
            src={`/calculate/Character_${Math.floor(Math.random() * 4 + 1)
              .toString()
              .padStart(2, "0")}.svg`}
            alt="character"
            width={200}
            height={230}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default HistoryCompareCard;
