import React from "react";
import CarbonEmissionCard from "./CarbonEmissionCard";
import { MonthlyData } from "@/types/calculate";

const CarbonEmissionCardList: React.FC<{ currentData: MonthlyData | null }> = ({
  currentData
}) => {
  console.log(currentData);
  // 최대 배출량 품목
  const highestCo2Value = Math.max(
    currentData?.electricity_co2 ?? 0,
    currentData?.gas_co2 ?? 0,
    currentData?.water_co2 ?? 0,
    currentData?.waste_co2 ?? 0,
    currentData?.car_co2 ?? 0
  );

  // 최저 배출량 품목
  const lowestCo2Value = Math.min(
    currentData?.electricity_co2 ?? 0,
    currentData?.gas_co2 ?? 0,
    currentData?.water_co2 ?? 0,
    currentData?.waste_co2 ?? 0,
    currentData?.car_co2 ?? 0
  );
  return (
    <div className="flex flex-wrap w-full md:w-[1200px] gap-[12px] md:gap-[30px]">
      <CarbonEmissionCard
        logo={"/calculate/electricity_color.svg"}
        title={"전기"}
        usageValue={currentData?.electricity_usage}
        co2Value={currentData?.electricity_co2}
        isHighest={currentData?.electricity_co2 === highestCo2Value}
        isLowest={currentData?.electricity_co2 === lowestCo2Value}
        unit="kwh"
      />
      <CarbonEmissionCard
        logo={"/calculate/gas_color.svg"}
        title={"가스"}
        usageValue={currentData?.gas_usage}
        co2Value={currentData?.gas_co2}
        isHighest={currentData?.gas_co2 === highestCo2Value}
        isLowest={currentData?.gas_co2 === lowestCo2Value}
        unit="m³"
      />
      <CarbonEmissionCard
        logo={"/calculate/water_color.svg"}
        title={"수도"}
        usageValue={currentData?.water_usage}
        co2Value={currentData?.water_co2}
        isHighest={currentData?.water_co2 === highestCo2Value}
        isLowest={currentData?.water_co2 === lowestCo2Value}
        unit="m³"
      />
      <CarbonEmissionCard
        logo={"/calculate/car_color.svg"}
        title={"교통"}
        usageValue={currentData?.car_usage}
        co2Value={currentData?.car_co2}
        isHighest={currentData?.car_co2 === highestCo2Value}
        isLowest={currentData?.car_co2 === lowestCo2Value}
        unit="km"
      />
      <CarbonEmissionCard
        logo={"/calculate/waste_color.svg"}
        title={"폐기물"}
        usageValue={currentData?.waste_volume}
        co2Value={currentData?.waste_co2}
        isHighest={currentData?.waste_co2 === highestCo2Value}
        isLowest={currentData?.waste_co2 === lowestCo2Value}
        unit="Kg"
      />
    </div>
  );
};

export default CarbonEmissionCardList;
