"use client";
import React, { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { CarbonFormData } from "@/types/calculate";
import browserClient from "@/utlis/supabase/browserClient";
import { useRouter } from "next/navigation";
import { userStore } from "@/zustand/userStore";
import YearMonthPickerMain from "@/components/calculator/YearMonthPickerMain";
import InputFiledSection from "@/components/calculator/InputFiledSection";
import FormHeader from "@/components/shared/FormHeader";
import HeaderTitle from "@/components/layout/HeaderTitle";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const Page = () => {
  const [thisYear, setThisYear] = useState<number | null>(currentYear);
  const [thisMonth, setThisMonth] = useState<number | null>(currentMonth);
  const [fuelType, setFuelType] = useState("휘발유"); // 연료 타입 상태 추가

  const router = useRouter();
  const { user } = userStore();

  // 제출 버튼 submit (계산 로직)
  const onSubmit: SubmitHandler<CarbonFormData> = async (data) => {
    const electricity = Number(data.electricity) || 0;
    const water = Number(data.water) || 0;
    const gas = Number(data.gas) || 0;
    const car = Number(data.car) || 0;
    const waste = Number(data.waste) || 0;

    // 연료 타입이 없으면 기본값으로 '휘발유'를 사용
    const selectedFuelType = fuelType || "휘발유"; // 현재 선택된 연료 타입 사용

    // 연료 종류에 따른 계산식
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

    // 총 배출량 계산
    const total =
      electricity * 0.4781 +
      water * 0.237 +
      gas * 2.176 +
      getCarCo2(car, selectedFuelType) +
      waste * 0.5573;

    try {
      // 기존 데이터 조회
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

      // 기존 데이터가 있으면 업데이트, 없으면 삽입
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
            car_co2: getCarCo2(car, selectedFuelType).toFixed(2),
            waste_volume: waste,
            waste_co2: (waste * 0.5573).toFixed(2),
            carbon_emissions: total.toFixed(2)
          })
          .eq("user_id", user.id) // 사용자의 id
          .eq("year", thisYear) // 연도
          .eq("month", thisMonth); // 월

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
          car_co2: getCarCo2(car, selectedFuelType).toFixed(2),
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

      // 결과 페이지로 리다이렉션
      router.push(`/calculator/result/${thisYear}/${thisMonth}`);
    } catch (err) {
      console.error("에러 발생:", err);
      alert("데이터 처리 중 오류가 발생했습니다.");
    }
  };

  // 연도와 달 handler
  const handleYearChange = (year: number) => {
    setThisYear(year);
  };
  const handleMonthChange = (month: number) => {
    setThisMonth(month);
  };

  return (
    <>
      <div className="w-full min-w-[360px] max-w-[1200px] mx-auto">
        <div className="px-[20px] md:px-[0px] mb-[80px]">
          {/* 페이지 header */}
          <div className="mb-[58px] md:mb-[80px]">
            <div className="pt-[76px] mb-[36px] md:mb-[48px] ">
              <FormHeader text="탄소 계산기 홈" location="/calculator" />
            </div>
            <HeaderTitle
              title="탄소 배출량 계산 결과표"
              description="이번 달 이산화탄소 배출량을 계산해 보세요"
            />
          </div>

          {/* 날짜 선택 드롭다운 */}
          <div className="flex mb-[44px] md:mb-[36px]">
            <YearMonthPickerMain
              thisYear={thisYear}
              thisMonth={thisMonth}
              onChangeYear={handleYearChange}
              onChangeMonth={handleMonthChange}
              disabled={false}
            />
          </div>

          {/* 인풋박스 */}
          <div className="flex flex-col mb-[44px] md:mb-[48px] gap-[10px]">
            <InputFiledSection
              fuelType={fuelType}
              setFuelType={setFuelType}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;
