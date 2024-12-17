// shared/CalculatorLayout.tsx
import React from "react";

const CalculatorLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
};

export default CalculatorLayout;
