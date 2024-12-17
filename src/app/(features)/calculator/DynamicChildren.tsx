// calculator/DynamicChildren.tsx
import React, { ReactNode } from "react";

// children의 타입을 ReactNode로 정의
const DynamicChildren = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default DynamicChildren;
