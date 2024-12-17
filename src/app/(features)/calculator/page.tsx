import React from "react";
import dynamic from "next/dynamic";

// dynamic 로딩을 사용하여 SSR 방지
const CalculatorLayout = dynamic(() => import("./layout"), { ssr: false });
import Main from "@/components/calculator/Main";

const Page = () => {
  return (
    <CalculatorLayout>
      <Main />
    </CalculatorLayout>
  );
};

export default Page;
