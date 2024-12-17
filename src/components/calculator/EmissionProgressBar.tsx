import Image from "next/image";

interface UserTopData {
  user_id: string;
  carbon_emissions: number;
}

interface LevelInfo {
  profileSmall: string;
}

interface userInfo {
  user_nickname: string;
}

interface EmissionProgressBarProps {
  myAllAvgData: number;
  userTopData: UserTopData | null;
  userAvgData: number | 0;
  levelInfo: LevelInfo;
  userInfo: userInfo | null;
}

const EmissionProgressBar: React.FC<EmissionProgressBarProps> = ({
  myAllAvgData,
  userTopData,
  userAvgData,
  levelInfo,
  userInfo
}) => {
  return (
    <div className="flex w-[270px] md:w-[500px] h-[128px] md:h-[220px] justify-center bg-[#F5F5F5] rounded-[14px] px-4">
      <div className="relative mt-[60px] md:mt-[115px]">
        {/* 프로그레스바 모양 */}
        <div className="flex flex-row gap-1">
          <div className="w-[50px] h-[10px] md:w-[88px] md:h-[16px] rounded-full bg-[#BFCEFE]" />
          <div className="w-[50px] h-[10px] md:w-[88px] md:h-[16px] rounded-full bg-[#9EB6FE]" />
          <div className="w-[50px] h-[10px] md:w-[88px] md:h-[16px] rounded-full bg-[#7E9DFD]" />
          <div className="w-[50px] h-[10px] md:w-[88px] md:h-[16px] rounded-full bg-[#5E85FD]" />
        </div>

        {/* 최저와 최고 텍스트 */}
        <div className="absolute left-0 top-[16px] md:top-[28px] text-[8px] md:text-[14px] text-gray-700 text-left">
          <div>최저</div>
          <div className="font-semibold">0 kg</div>
        </div>
        <div className="absolute right-0 top-[16px] md:top-[28px] text-[8px] md:text-[14px] text-gray-700 text-right">
          <div>최대</div>
          <div className="font-semibold">
            {userTopData?.carbon_emissions.toFixed(2)} kg
          </div>
        </div>

        {/* 프로그레스바 네이밍 */}
        <div
          className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center"
          style={{
            left: `${
              userTopData?.carbon_emissions && myAllAvgData !== null
                ? Math.min(
                    Math.max(
                      0,
                      (myAllAvgData / userTopData?.carbon_emissions) * 100
                    ),
                    100
                  ).toFixed(2)
                : 0
            }%`
          }}
        >
          <div className="relative top-[-30px] md:top-[-52px] w-[70px] h-[25px] md:min-w-[144px] md:h-[40px] rounded-full bg-black p-2">
            <div className="absolute flex justify-start items-center text-[8px] md:text-[14px] font-semibold top-[6px] md:top-[6px] text-white gap-[6px] md:gap-[10px]">
              <Image
                src={levelInfo.profileSmall}
                alt="내 레벨 이미지"
                width={28}
                height={28}
                className="w-[16px] md:w-[28px] rounded-[12px]"
              />
              <div>
                {userInfo?.user_nickname && (
                  <span className="block md:hidden">
                    {userInfo.user_nickname.length > 4
                      ? `${userInfo.user_nickname.slice(0, 4)}...`
                      : userInfo.user_nickname}
                  </span>
                )}
                {userInfo?.user_nickname && (
                  <span className="hidden md:block">
                    {userInfo.user_nickname.length > 6
                      ? `${userInfo.user_nickname.slice(0, 6)}...`
                      : userInfo.user_nickname}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-[-3px] md:top-[-5px] z-5">
            <div
              className={`w-[15px] h-[15px] md:w-[26px] md:h-[26px] rounded-full flex items-center justify-center ${
                myAllAvgData &&
                userTopData?.carbon_emissions &&
                myAllAvgData / userTopData?.carbon_emissions < 0.25
                  ? "bg-[#BFCEFE]"
                  : userTopData?.carbon_emissions &&
                    myAllAvgData / userTopData?.carbon_emissions < 0.5
                  ? "bg-[#9EB6FE]"
                  : userTopData?.carbon_emissions &&
                    myAllAvgData / userTopData?.carbon_emissions < 0.75
                  ? "bg-[#7E9DFD]"
                  : "bg-[#5E85FD]"
              }`}
            >
              <div className="w-[8px] h-[8px] md:w-[14px] md:h-[14px] bg-white rounded-full" />
            </div>
          </div>
        </div>
        <div
          className="absolute top-[3px] transform -translate-x-1/2 flex flex-col items-center"
          style={{
            left: `${
              userTopData?.carbon_emissions && userAvgData !== null // 이 두개의 값이 다 있을 때만 계산 시작
                ? // 위치 계산 시작
                  Math.min(
                    Math.max(
                      0,
                      (Number(userAvgData) / userTopData?.carbon_emissions) *
                        100
                    ),
                    100
                  ).toFixed(2)
                : 0
            }%`
          }}
        >
          <div className="w-[5px] h-[5px] md:w-[10px] md:h-[10px] bg-white rounded-full" />
          <div className="flex flex-col items-center md:gap-1 text-[8px] md:text-[14px] text-gray-700">
            <div className="flex flex-col items-center bg-[#F5F5F5] mt-[6px] md:mt-[10px] px-3 py-0 rounded-md gap-[3px] z-2 leading-[1]">
              <div className="mt-[6px] py-0">평균</div>
              <div className="font-semibold">{userAvgData.toFixed(2)} kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionProgressBar;
