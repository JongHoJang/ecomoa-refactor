import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { ThisMonthResultChartProps } from "@/types/calculate";
import { CustomDataLabelsContext } from "./MonthlyChartMain";
import { ScriptableScaleContext } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ThisMonthChart: React.FC<ThisMonthResultChartProps> = ({
  currentData,
  totalAvgData
}) => {
  const data = {
    labels: ["평균", "내 배출량"],
    datasets: [
      {
        label: "탄소 배출량 비교",
        data: [
          totalAvgData?.carbon_emissions || 0, // "유저 평균 "
          currentData?.carbon_emissions || 0 // "내 배출량 "
        ],
        backgroundColor: ["#A1A7B4", "#0D9C36"],
        borderColor: ["#A1A7B4", "#0D9C36"],
        borderWidth: 1,
        borderRadius: [8, 8],
        categoryPercentage: 0.9,
        barPercentage: 0.6
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false // 범례 숨기기
      },
      title: {
        display: true
      },
      datalabels: {
        align: "end" as const,
        anchor: "end" as const,
        font: {
          size: 16,
          weight: 600
        },
        color: (context: CustomDataLabelsContext) => {
          const dataset = context.chart.data.datasets[context.datasetIndex];
          const lastIndex = dataset.data.length - 1;

          // "내 배출량"에 해당하는 텍스트의 색상을 바꿈
          if (context.dataIndex === lastIndex && context.datasetIndex === 0) {
            return "#0D9C36"; // "내 배출량" 텍스트 색상을 초록색으로
          }
          return "#A1A7B4"; // 나머지 데이터는 기본 색상
        },
        formatter: (value: number) => `${value} Kg` // 값 뒤에 "Kg" 추가
      }
    },
    layout: {
      padding: 20
    },
    scales: {
      y: {
        display: false,
        grid: {
          display: false
        }
      },
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 14,
            weight: 600
          },
          // x축 레이블 색상을 지정하는 부분
          color: (context: ScriptableScaleContext) => {
            const labels = ["평균", "내 배출량"];
            const label = labels[context.index];

            if (label === "내 배출량") {
              return "#0D9C36";
            }
            return "#A1A7B4";
          }
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Bar data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default ThisMonthChart;
