"use client";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { CarbonFormData } from "@/types/calculate";
import browserClient from "@/utlis/supabase/browserClient";
import { useRouter } from "next/navigation";
import { userStore } from "@/zustand/userStore";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const useCarbonCalculator = () => {
  const [thisYear, setThisYear] = useState<number>(currentYear);
  const [thisMonth, setThisMonth] = useState<number>(currentMonth);
  const [fuelType, setFuelType] = useState("휘발유");

  const router = useRouter();
  const { user } = userStore();

  const getCarCo2 = (car: number, fuelType: string): number => {
    switch (fuelType) {
      case "휘발유":
        return (car / 16.04) * 2.097;
      case "경유":
        return (car / 15.35) * 2.582;
      case "LPG":
        return (car / 11.06) * 1.868;
      default:
        return 0;
    }
  };

  const onSubmit: SubmitHandler<CarbonFormData> = async (data) => {
    const electricity = Number(data.electricity) || 0;
    const water = Number(data.water) || 0;
    const gas = Number(data.gas) || 0;
    const car = Number(data.car) || 0;
    const waste = Number(data.waste) || 0;

    const total =
      electricity * 0.4781 +
      water * 0.237 +
      gas * 2.176 +
      getCarCo2(car, fuelType) +
      waste * 0.5573;

    try {
      const { data: existingData, error: fetchError } = await browserClient
        .from("carbon_records")
        .select("*")
        .eq("user_id", user.id)
        .eq("year", thisYear)
        .eq("month", thisMonth);

      if (fetchError) {
        console.error("기존 데이터 조회 오류:", fetchError);
        alert(
          `총 이산화탄소 배출량은 ${total.toFixed(2)}kg 입니다.\n\n` +
            "로그인 후 사용하시면 배출량을 저장하고 관리할 수 있어요.\n" +
            "로그인 후 이용해주세요."
        );
        router.push(`/login`);
        return;
      }

      const selectedData =
        existingData && existingData.length > 0 ? existingData[0] : null;

      if (selectedData) {
        const { error } = await browserClient
          .from("carbon_records")
          .update({
            electricity_usage: electricity,
            electricity_co2: (electricity * 0.4781).toFixed(2),
            water_usage: water,
            water_co2: (water * 0.237).toFixed(2),
            gas_usage: gas,
            gas_co2: (gas * 2.176).toFixed(2),
            car_usage: car,
            car_co2: getCarCo2(car, fuelType).toFixed(2),
            waste_volume: waste,
            waste_co2: (waste * 0.5573).toFixed(2),
            carbon_emissions: total.toFixed(2)
          })
          .eq("user_id", user.id)
          .eq("year", thisYear)
          .eq("month", thisMonth);

        if (error) {
          console.error("데이터 업데이트 오류:", error);
          alert("데이터 업데이트 중 오류가 발생했습니다.");
        }
      } else {
        const { error } = await browserClient.from("carbon_records").insert({
          user_id: user.id,
          electricity_usage: electricity,
          electricity_co2: (electricity * 0.4781).toFixed(2),
          water_usage: water,
          water_co2: (water * 0.237).toFixed(2),
          gas_usage: gas,
          gas_co2: (gas * 2.176).toFixed(2),
          car_usage: car,
          car_co2: getCarCo2(car, fuelType).toFixed(2),
          waste_volume: waste,
          waste_co2: (waste * 0.5573).toFixed(2),
          carbon_emissions: total.toFixed(2),
          year: Number(thisYear),
          month: Number(thisMonth)
        });

        if (error) {
          console.error("데이터 삽입 오류:", error);
          alert("데이터 삽입 중 오류가 발생했습니다.");
        }
      }

      router.push(`/calculator/result/${thisYear}/${thisMonth}`);
    } catch (err) {
      console.error("에러 발생:", err);
      alert("데이터 처리 중 오류가 발생했습니다.");
    }
  };

  return {
    thisYear,
    thisMonth,
    fuelType,
    setThisYear,
    setThisMonth,
    setFuelType,
    onSubmit
  };
};

export default useCarbonCalculator;
