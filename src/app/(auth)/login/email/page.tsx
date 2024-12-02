import React from "react";
import LoginForm from "../components/LoginForm";
import Image from "next/image";

const EmailLoginPage = () => {
  return (
    <div
      className="min-h-screen bg-[#F2F9F2] md:px-4 bg-none sm:bg-[url('/images/background.png')] sm:bg-no-repeat sm:bg-cover sm:bg-center"
      style={{
        backgroundSize: "2421px 1255px",
        backgroundPosition: "-245px 90px"
      }}
    >
      <div className="mx-auto max-w-md flex-col-center">
        <div className="w-[150px] md:w-[180px] mt-[130px] md:mt-[240px] mb-[40px]">
          <Image
            src={"/images/logo.png"}
            width={180}
            height={30}
            alt="ecomoa 로고"
          />
        </div>

        <div>
          <h1 className="text-[24px] md:text-3xl font-[600] text-center leading-[33.6px] tracking-[-0.24px] md:leading-tight">
            에코모아에 가입하고
            <br />
            탄소 절감 혜택을 누려보세요!
          </h1>
        </div>

        <div className="w-[322px] md:w-[400px] mt-[130px] sm:mt-[88px] mb-[24px] flex items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
          <p className="text-[12px] md:text-[16px] leading-[16.8px] md:leading-[24px] px-4 text-[#525660] font-extrabold">
            이메일 로그인하기
          </p>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <LoginForm />
      </div>
      <div className="h-[130px] md:hidden"></div>
    </div>
  );
};

export default EmailLoginPage;
