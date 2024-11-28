import Image from "next/image";
import React from "react";

interface LoadingProps {
  message?: string;
  subMessage?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "탄소 배출량 계산 중",
  subMessage = "잠시만 기다려 주세요~!"
}) => {
  return (
    <div className=" w-full w-min-[360px] fixed inset-0 z-50 bg-[rgba(0,3,1,0.75)] min-h-screen md:px-0">
      <div className="w-full md:mx-auto mt-[200px]">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col gap-8 text-white text-[24px] md:text-[32px] font-semibold text-center">
            <div>{message}</div>
            <div>{subMessage}</div>
          </div>
          <div className="mt-[48px] w-[320px] h-[320px] md:w-[360px] md:h-[360px]">
            <Image
              src="/calculate/Loading.svg"
              alt="Loading-character"
              width={380}
              height={380}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
