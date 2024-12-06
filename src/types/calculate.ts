import { UUID } from "crypto";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

// FormData type 정리
export interface FormData {
  electricity: number;
  water: number;
  gas: number;
  car: number;
  waste: number;
}

// InputFieldProps type 정리
export interface InputFieldProps {
  id: keyof CarbonFormData; // 'electricity' | 'gas' | 'water' | ...
  label: string;
  register: UseFormRegister<CarbonFormData>;
  errors: FieldErrors<CarbonFormData>;
  requiredMessage: string;
  placeholder: string;
  unit: string;
  setValue: UseFormSetValue<CarbonFormData>;
  fuelType?: string;
  setFuelType?: (type: string) => void;
}

// 이번달 내 사용량
export interface currentMonthly {
  user_id: UUID;
  year: number;
  month: number;
  electricity_usage: number;
  electricity_co2: number;
  water_usage: number;
  water_co2: number;
  gas_usage: number;
  gas_co2: number;
  car_usage: number;
  car_co2: number;
  waste_volume: number;
  waste_co2: number;
  carbon_emissions: number;
}

// 이번달 내 사용량 차트용
export interface MonthlyChartProps {
  currentMonthly?: MonthlyData | null;
  currentData?: MonthlyData | null;
  totalAvgData?: MonthlyData | null;
}

// 이번달 유저 전체 사용량
export interface totalCurrentMonthly {
  // user_id: UUID;
  year: number;
  month: number;
  electricity_usage: number;
  electricity_co2: number;
  water_usage: number;
  water_co2: number;
  gas_usage: number;
  gas_co2: number;
  car_usage: number;
  car_co2: number;
  waste_volume: number;
  waste_co2: number;
  carbon_emissions: number;
}

//
export interface MonthlyData {
  year: number;
  month: number;
  electricity_usage: number;
  electricity_co2: number;
  water_usage: number;
  water_co2: number;
  gas_usage: number;
  gas_co2: number;
  car_usage: number;
  car_co2: number;
  waste_volume: number;
  waste_co2: number;
  carbon_emissions: number;
  created_at?: string;
}

export interface ThisMonthChartProps {
  currentData: MonthlyData | null;
  totalAvgData: MonthlyData | null;
  lastData: MonthlyData | null;
  lastTotalAvgData: MonthlyData | null;
}

export interface ThisMonthResultChartProps {
  currentData: MonthlyData | null;
  totalAvgData: MonthlyData | null;
}

export interface CarbonFormData {
  electricity: number;
  water: number;
  gas: number;
  car: number;
  waste: number;
}

export interface CarbonFormDataFuelType {
  electricity: number;
  water: number;
  gas: number;
  car: number;
  waste: number;
  fuelType: "휘발유" | "경유" | "LPG"; // 제한된 문자열 값
}
