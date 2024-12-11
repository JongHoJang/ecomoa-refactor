import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  text: string;
  location: string;
}

const FormHeader = ({ text, location }: Props) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push(`${location}`);
  };

  return (
    <>
      <button
        onClick={handleGoBack}
        className="flex flex-row items-center text-sm md:text-[16px] font-bold mb-2 md:mb-4 text-[#525660] hover:text-gray-400 transition-colors border-none"
      >
        <ChevronLeft className="w-4 h-4 text-[#525660]" />
        <p>{text}</p>
      </button>
      <hr />
    </>
  );
};

export default FormHeader;
