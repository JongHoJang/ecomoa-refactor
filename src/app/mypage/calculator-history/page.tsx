import ResultList from "@/components/calculator/ResultList";
import React from "react";

const page = () => {
  return (
    <div className="bg-[#F2F9F2] min-h-[835px]">
      <div className="w-full min-w-[360px] max-w-[1200px] mx-auto">
        <div className="px-[20px] md:px-[0px] pb-[58px] md:pb-[80px]">
          <ResultList type="mypage" />
        </div>
      </div>
    </div>
  );
};

export default page;
