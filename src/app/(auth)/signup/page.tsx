import React from "react";
import SignupForm from "./components/SignupForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const SignupPage = () => {
  return (
    <div className="mx-auto md:max-w-[1200px] h-auto md:mb-[80px] bg-[#FFF] px-[20px] md:px-4">
      <div className="h-auto">
        <div className="flex items-center mb-[16px] md:mb-[20px] pt-[36px] md:pt-[76px]">
          <ChevronLeft />
          <Link href={"/login"} className="text-[#525660]">
            <span className="text-[16px] font-[600]">로그인 홈</span>
          </Link>
        </div>
        <div className="w-full border-b border-b-[#D5D7DD]"></div>
        <p className="text-[24px] md:text-[32px] font-[700] mt-[36px] md:mt-[48px] leading-[33.6px] md:leading-[44.8px] tracking-[-0.24px] md:tracking-[-0.32px] text-[#000301]">
          이메일 회원가입
        </p>
        <p className="text-[#00691E] text-[16px] md:text-[20px] font-[500] leading-[22.4px] md:leading-[30px] tracking-[-0.16px] md:tracking-[-0.2px] mt-[16px] md:mt-[24px]">
          가입을 위한 이메일 정보를 입력해주세요
        </p>
        <div className="mt-[58px] md:mt-[120px]">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
