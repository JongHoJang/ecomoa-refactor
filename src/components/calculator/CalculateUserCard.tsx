import { MonthlyData } from "@/types/calculate";
import Image from "next/image";
import Link from "next/link";

export interface MyInfo {
  user_nickname?: string;
  profile?: string;
  levelInfo?: string;
}

interface CalculateUserCardProps {
  userInfo: MyInfo | null; // userInfo는 null일 수 있음
  myAllData: MonthlyData[] | null; // myAllData도 null일 수 있음
  levelInfo: MyInfo | null;
}

const CalculateUserCard: React.FC<CalculateUserCardProps> = ({
  userInfo,
  myAllData,
  levelInfo
}) => {
  // myAllData가 null일 경우 기본값 설정
  const dataLength = myAllData ? myAllData.length : 0;

  return (
    <div className="min-w-[320px] w-full bg-white rounded-2xl border border-[#dcecdc] mb-[58px] md:px-[80px]">
      <div className="flex flex-col md:flex-row w-full h-[200px] md:h-[140px] md:justify-between py-[20px] items-center">
        <div className="flex items-center">
          <Image
            src={levelInfo?.profile || "/default-profile-image.jpg"} // 기본값 설정
            alt="미리보기"
            width={114}
            height={84}
            className="w-[114px] h-[84px] rounded-[12px]"
          />
          <div className="ml-[31px]">
            <div className="text-[20px] md:text-[28px] font-semibold">
              {userInfo?.user_nickname}님
            </div>
          </div>
        </div>

        {/* 결과표 버튼 */}
        <div className="mt-[28px] md:mt-0">
          <Link href="/calculator/result-list">
            <div className="flex w-[280px] h-[50px] md:w-[320px] md:h-[60px] bg-[#00320f] rounded-[40px] justify-center items-center gap-4 text-white ">
              <div className="text-[16px] md:text-[18px]">
                탄소 배출량 계산 결과표
              </div>
              <div className="text-[28px] md:text-[36px] font-semibold">
                {dataLength ? `${dataLength}건` : "0건"}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CalculateUserCard;
