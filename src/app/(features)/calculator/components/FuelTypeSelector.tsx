import React from "react";

const FuelTypeSelector: React.FC<{
  selectedFuelType: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ selectedFuelType, onChange }) => {
  return (
    <div>
      <div className="flex gap-[20px]">
        <label className="flex gap-1 text-[14px] justify-center items-center">
          <input
            type="radio"
            value="휘발유"
            checked={selectedFuelType === "휘발유"}
            onChange={onChange}
            className="w-[20px] h-[20px] border-[1.5px] border-gray-500 rounded-full checked:bg-transparent"
          />
          휘발유
        </label>
        <label className="flex gap-1 text-[14px] justify-center items-center">
          <input
            type="radio"
            value="경유"
            checked={selectedFuelType === "경유"}
            onChange={onChange}
            className="w-[20px] h-[20px] border-[1.5px] border-gray-500 rounded-full checked:bg-transparent"
          />
          경유
        </label>
        <label className="flex gap-1 text-[14px] justify-center items-center">
          <input
            type="radio"
            value="LPG"
            checked={selectedFuelType === "LPG"}
            onChange={onChange}
            className="w-[20px] h-[20px] border-[1.5px] border-gray-500 rounded-full checked:bg-transparent"
          />
          LPG
        </label>
        <label className="flex gap-1 text-[14px] justify-center items-center">
          <input
            type="radio"
            value="없음"
            checked={selectedFuelType === "없음"}
            onChange={onChange}
            className="w-[20px] h-[20px] border-[1.5px] border-gray-500 rounded-full checked:bg-transparent"
          />
          없음
        </label>
      </div>
    </div>
  );
};

export default FuelTypeSelector;
