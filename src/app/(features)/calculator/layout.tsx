// calculator/layout.tsx
import dynamic from "next/dynamic";

// dynamic으로 CalculatorLayout을 로드하여 SSR 방지
const CalculatorLayout = dynamic(() => import("./CalculatorLayout"), {
  ssr: false
});

export default function CalculatorLayoutWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  return <CalculatorLayout>{children}</CalculatorLayout>;
}
