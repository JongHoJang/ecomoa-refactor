import { MonthlyData } from "@/types/calculate";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartJS,
  ChartDataset
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import ChartDataLabels from "chartjs-plugin-datalabels";

interface MonthlyChartMainProps {
  emissionsData: MonthlyData[] | null;
  currentData: MonthlyData[] | null;
}

export interface CustomDataLabelsContext {
  chart: ChartJS;
  datasetIndex: number;
  dataIndex: number;
  dataset: ChartDataset;
}

const MonthlyChartMain: React.FC<MonthlyChartMainProps> = ({
  emissionsData,
  currentData
}) => {
  const getLastFiveMonthsData = (data: MonthlyData[] | null) => {
    const filledData = Array(12).fill(0);
    data?.forEach((monthData) => {
      const monthIndex = monthData.month - 1;
      filledData[monthIndex] = monthData.carbon_emissions;
    });

    const lastMonthIndex = data ? data[data.length - 1]?.month - 1 : 11;
    return filledData.slice(
      Math.max(0, lastMonthIndex - 4),
      lastMonthIndex + 1
    );
  };

  const datasets = [
    {
      label: "평균 배출량",
      data: getLastFiveMonthsData(emissionsData),
      backgroundColor: ["#D9D9D9"],
      borderColor: ["#D9D9D9"],
      borderWidth: 1,
      borderRadius: 8,
      categoryPercentage: 0.7,
      barPercentage: 0.7
    },
    {
      label: "나의 총 배출량",
      data: getLastFiveMonthsData(currentData),
      backgroundColor: ["#FF7D6F"],
      borderColor: ["#FF7D6F"],
      borderWidth: 1,
      borderRadius: 8,
      categoryPercentage: 0.7,
      barPercentage: 0.7
    }
  ];

  const lastFiveMonthsLabels = (data: MonthlyData[] | null) => {
    const lastMonth = data ? data[data.length - 1]?.month : 12;
    const labels = [];
    for (let i = 4; i >= 0; i--) {
      const month = (lastMonth - i + 12) % 12 || 12;
      labels.push(`${String(month).padStart(2, "0")}월`);
    }
    return labels;
  };

  const data = {
    labels: lastFiveMonthsLabels(currentData),
    datasets: datasets
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          padding: 10
        }
      },
      title: {
        display: false
      },
      datalabels: {
        align: "end" as const,
        anchor: "end" as const,
        font: {
          size: 16
        },
        // formatter 함수에서 마지막 데이터의 오른쪽 바만 bgColor 추가
        color: (context: CustomDataLabelsContext) => {
          const dataset = context.chart.data.datasets[context.datasetIndex];
          const lastIndex = dataset.data.length - 1;

          if (context.dataIndex === lastIndex && context.datasetIndex === 1) {
            return "#ffffff"; // 마지막 데이터의 텍스트 색을 흰색으로
          }
          return "#32343a"; // 나머지 데이터는 기본 색상
        },
        formatter: (value: number, context: CustomDataLabelsContext) => {
          // 수정된 부분
          // 마지막 데이터 (나의 총 배출량) 인덱스를 찾습니다.
          const roundedValue = Math.round(value); // 소수점을 반올림

          const lastIndex = context.dataset.data.length - 1;
          if (context.dataIndex === lastIndex) {
            return `${roundedValue} Kg`; // 오른쪽 바의 라벨
          }
          return `${roundedValue} Kg`; // 일반적인 데이터 라벨
        },
        backgroundColor: (context: CustomDataLabelsContext) => {
          // 수정된 부분
          const lastIndex = context.dataset.data.length - 1;
          // 오른쪽 바는 데이터셋에서 두 번째 데이터 인덱스
          if (context.dataIndex === lastIndex && context.datasetIndex === 1) {
            return "#000"; // 오른쪽 바에 배경 색 지정
          }
          return "transparent"; // 나머지 데이터는 배경을 투명으로 설정
        },
        borderRadius: (context: CustomDataLabelsContext) => {
          // 수정된 부분
          // 마지막 데이터 (나의 총 배출량)에서만 borderRadius 적용
          if (
            context.datasetIndex === 1 &&
            context.dataIndex === context.dataset.data.length - 1
          ) {
            return 50; // 'full'을 의미하는 값, 둥근 테두리
          }
          return 0; // 다른 바에는 기본 borderRadius 적용 안 함
        },
        padding: 6 // 배경 색에 여백 추가
      }
    },
    layout: {
      padding: {
        top: 50,
        bottom: 30
      }
    },
    scales: {
      y: {
        display: false,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 14
          },
          max: 140
        }
      },
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 14
          },
          padding: 10 // x축 간격 설정
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

export default MonthlyChartMain;
