// // calculator/layout.tsx
// import React from "react";

// export default function CalculatorLayout({
//   children
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <div>{children}</div>
//     </div>
//   );
// }

// calculator/layout.tsx
import dynamic from "next/dynamic";
import React from "react";

// dynamic import로 children을 클라이언트 측에서만 렌더링
const DynamicChildren = dynamic(() => import("./DynamicChildren"), {
  ssr: false // 클라이언트 사이드에서만 렌더링
});

export default function CalculatorLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        {/* 클라이언트 측에서만 렌더링되는 children */}
        <DynamicChildren>{children}</DynamicChildren>
      </div>
    </div>
  );
}
