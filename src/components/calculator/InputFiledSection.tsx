import { useForm, SubmitHandler } from "react-hook-form";
import InputField from "@/components/calculator/InputField";
import { CarbonFormData } from "@/types/calculate";
import AutoWidthButton from "../shared/AutoWidthButton";

interface InputFiledSectionProps {
  fuelType: string;
  setFuelType: (type: string) => void;
  onSubmit: SubmitHandler<CarbonFormData>;
}

const InputFiledSection: React.FC<InputFiledSectionProps> = ({
  fuelType,
  setFuelType,
  onSubmit
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<CarbonFormData>({
    mode: "onChange"
  });

  const isFormValid = Object.values(watch()).every(
    (value) => value !== "" && value !== null
  );

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col mb-[44px] md:mb-[48px] gap-[10px]">
        <InputField
          id="electricity"
          label="전기"
          register={register}
          errors={errors}
          requiredMessage="사용한 전기량을 입력해주세요"
          placeholder="사용하신 에너지 양을 입력해 주세요"
          unit="kwh/월"
          setValue={setValue}
        />
        <InputField
          id="gas"
          label="가스"
          register={register}
          errors={errors}
          requiredMessage="사용한 가스량을 입력해주세요"
          placeholder="사용하신 에너지 양을 입력해 주세요"
          unit="m³/월"
          setValue={setValue}
        />
        <InputField
          id="water"
          label="수도"
          register={register}
          errors={errors}
          requiredMessage="사용한 수도량을 입력해주세요"
          placeholder="사용하신 에너지 양을 입력해 주세요"
          unit="m³/월"
          setValue={setValue}
        />
        <InputField
          id="car"
          label="자가용"
          register={register}
          errors={errors}
          requiredMessage="연료종류 선택과 사용량을 모두 입력해주세요"
          placeholder="사용하신 에너지 양을 입력해 주세요"
          unit="km/월"
          fuelType={fuelType}
          setFuelType={setFuelType}
          setValue={setValue}
        />
        <InputField
          id="waste"
          label="생활 폐기물"
          register={register}
          errors={errors}
          requiredMessage="폐기물량을 입력해주세요"
          placeholder="버리시는 폐기물 양을 입력해주세요 "
          unit="Kg/월"
          setValue={setValue}
        />
      </div>
      <div className="mx-auto w-full md:w-[380px] text-[18px] font-medium rounded-[40px]">
        <AutoWidthButton
          text="계산하기"
          type="submit"
          onClick={() => {}}
          disabled={!isFormValid || !isValid}
        />
      </div>
    </form>
  );
};

export default InputFiledSection;
