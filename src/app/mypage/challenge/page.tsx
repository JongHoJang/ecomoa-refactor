"use client";
import FormHeader from "@/components/shared/FormHeader";
import MyChallenge from "../components/MyChallenge";

const MyChallengePage = () => {
  return (
    <div className="min-h-screen bg-[#E8F3E8]">
      <div className="max-w-[1200px] mx-auto">
        <div className="pt-[76px] mb-[36px] md:mb-[48px] px-[20px] md:px-0">
          <FormHeader text="마이페이지 홈" location="/mypage" />
        </div>
        {/* 
        <Link href={"/mypage"} className="border-b-slate-500 w-[1200]">
          <div className="flex items-center mb-[20px] pt-[62.5px]">
            <ChevronLeft />
            <span className="text-[16px] font-[600] ">
              마이페이지
            </span>
          </div>
        </Link> */}
        <div className="pb-[10px]">
          <MyChallenge />
        </div>
      </div>
    </div>
  );
};

export default MyChallengePage;
