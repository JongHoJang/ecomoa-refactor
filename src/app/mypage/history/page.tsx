import ResultList from "@/app/(features)/calculator/components/ResultList";

import React from "react";

const page = () => {
  return (
    <div className="w-full min-w-[360px] max-w-[1200px] flex justify-center mx-auto">
      <ResultList type="mypage" />
    </div>
  );
};

export default page;