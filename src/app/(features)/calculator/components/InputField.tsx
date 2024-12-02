import { InputFieldProps } from "@/types/calculate";

import FuelTypeSelector from "./FuelTypeSelector";
import { useEffect } from "react";

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  register,
  errors,
  requiredMessage,
  placeholder,
  unit,
  fuelType,
  setFuelType,
  setValue
}) => {
  const handleFuelTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFuelType = e.target.value;
    if (setFuelType) {
      setFuelType(selectedFuelType);
      console.log(selectedFuelType);
    }
  };

  useEffect(() => {
    if (id === "car" && fuelType === "없음" && setValue) {
      setValue(id, 0); // "car" id일 때만 fuelType이 "없음"이면 값은 0으로 설정
    }
  }, [fuelType, id, setValue]);

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-black text-[12px] md:text-[14px] font-semibold mb-[12px]"
      >
        {label}
      </label>

      {/* id가 "car"일 때만 라디오 버튼을 표시 */}
      <div>
        {id === "car" && (
          <div className="mb-[12px]">
            <FuelTypeSelector
              selectedFuelType={fuelType}
              onChange={handleFuelTypeChange}
            />
          </div>
        )}
      </div>

      <div className="relative w-full">
        <input
          className="w-full h-[67px] text-[14px] md:text-[16px] rounded-[12px] bg-[#F5F5F5] text-between pl-[16px] md:pl-[32px] border-none placeholder:text-[#525660] disabled:placeholder:text-gray-300 disabled:cursor-not-allowed"
          id={id}
          type="number"
          placeholder={placeholder}
          {...register(id, {
            required: requiredMessage
          })}
          // "car" id일 때만 fuelType이 "없음"이면 값은 0, 다른 id는 빈 값
          value={id === "car" && fuelType === "없음" ? 0 : undefined}
          // "car" id일 때만 fuelType이 "없음"이면 비활성화
          disabled={id === "car" && fuelType === "없음"}
        />

        <span className="absolute right-0 md:right-2 top-1/2 transform -translate-y-1/2 font-semibold text-gray-700 pr-5 text-[12px] md:text-[16px]">
          {unit}
        </span>
      </div>
      <div className="h-[30px] pt-[10px]">
        {errors[id] && (
          <small className="text-red-500 text-[16px]">
            {errors[id] && <small role="alert">{errors[id]?.message}</small>}
          </small>
        )}
      </div>
    </div>
  );
};

export default InputField;
