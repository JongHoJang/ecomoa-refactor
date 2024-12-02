import { getUser } from "@/api/auth-actions";
import UserInfoCard from "./components/UserInfoCard";
import MyPoint from "./components/MyPoint";
import Link from "next/link";
import { getUserInfo } from "@/api/user-action";
import { ChevronRight } from "lucide-react";
const Mypage = async () => {
  const user = await getUser();
  if (!user) return;
  await getUserInfo(user.id);
  return (
    // 최상위 div에 min-h-screen 추가
    <div className="w-full min-h-screen bg-[#F4FFF4] px-[20px] md:px-0">
      <div className="flex flex-col gap-[10px] w-full md:max-w-[1200px] mx-auto">
        <h1 className="w-[130px] h-[18px] text-[20px] md:text-[26px] font-[700] leading-[36.4px] tracking-[-0.26px] mt-[36px] md:mt-[76px] mb-[20px] md:mb-[60px]">
          마이페이지
        </h1>
        <div className="flex flex-col md:flex-row justify-center gap-5 mb-9">
          <UserInfoCard user={user} />
          <MyPoint user={user} />
        </div>

        <Link
          href={"/mypage/challenge"}
          className="border-b-[#DCECDC] w-full h-[92px] p-[39px_40px] border-b border-gray-400 flex justify-between items-center"
        >
          <p className="text-[#000301] text-[18px] font-[500] leading-normal tracking-[-0.18px]">
            챌린지 히스토리
          </p>
          <ChevronRight />
        </Link>

        <Link
          href={"/mypage/history"}
          className="border-b-[#DCECDC] w-full h-[92px] p-[39px_40px] border-b border-gray-400 flex justify-between items-center"
        >
          <p className="text-[#000301] text-[18px] font-[500] leading-normal tracking-[-0.18px]">
            탄소계산 히스토리
          </p>
          <ChevronRight />
        </Link>

        <Link
          href={"/mypage/like/free"}
          className="border-b-[#DCECDC] w-full h-[92px] p-[39px_40px] border-b border-gray-400 flex justify-between items-center"
        >
          <p className="text-[#000301] text-[18px] font-[500] leading-normal tracking-[-0.18px]">
            나의 좋아요
          </p>
          <ChevronRight />
        </Link>

        <Link
          href={"/mypage/post/free"}
          className="border-b-[#DCECDC] w-full h-[92px] p-[39px_40px] border-b border-gray-400 flex justify-between items-center"
        >
          <p className="text-[#000301] text-[18px] font-[500] leading-normal tracking-[-0.18px]">
            나의 게시글
          </p>
          <ChevronRight />
        </Link>

        <div className="border-b-[#DCECDC] w-full h-[92px] p-[39px_40px] border-b border-gray-400 flex justify-between items-center">
          <Link
            href={"/delete"}
            className="text-[#000301] text-[18px] font-[500] leading-[1.5px] tracking-[-0.18px]"
          >
            회원 탈퇴
          </Link>
          <ChevronRight />
        </div>

        <div className="mb-[80px]">{/* <LogoutButton /> */}</div>
      </div>
    </div>
  );
};

export default Mypage;
