import type { ItemPriceAverage } from "@catarks/db";
import type { FC } from "react";
import { Line } from "react-chartjs-2";
import { SHIPS } from "~/const";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import type { ArrayElement } from "@catarks/utils";
import type { getItemPriceChartById } from "~/middlewares/charts";
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);


export const PriceChart: FC<{
  chartData: Awaited<ReturnType<typeof getItemPriceChartById>>;
}> = ({ chartData }) => {
  const colors: { [key in ArrayElement<typeof SHIPS>]: {
    backgroundColor: string
  } } = {
    0: { backgroundColor: "rgba(255, 99, 132, 0.5)" },
    1: { backgroundColor: "rgba(235, 140, 52, 05)" },
    2: { backgroundColor: "rgba(205, 235, 52, 05)" },
    3: { backgroundColor: "rgba(52, 235, 61, 05)" },
    4: { backgroundColor: "rgba(52, 235, 223, 05)" },
    5: { backgroundColor: "rgba(52, 125, 235, 05)" },
    6: { backgroundColor: "rgba(73, 52, 235, 05)" },
    7: { backgroundColor: "rgba(168, 52, 235, 05)" },
    8: { backgroundColor: "rgba(235, 52, 229, 05)" },
    9: { backgroundColor: "rgba(235, 52, 229, 05)" },
    10: { backgroundColor: "235, 52, 110" }
  }
  let datasets = [];
  for (const ship of SHIPS) {
    const targetShipPrices = chartData.body[ship]
    let datas: ({x: Date, y: number} | null)[] = []
    for (const date of chartData.dates) {
      const hitItem = targetShipPrices.find((price: ItemPriceAverage) => price.createdAt.getTime() === date.getTime())
      datas.push(hitItem?.price ? {x: hitItem?.createdAt, y: hitItem?.price} : null);
    }
    if (datas.length > 0) {
      datasets.push({
        label: ship === 0 ? "all" : `ship${ship}`,
        data: datas,
        // borderColor: colors[ship].borderColor,
        backgroundColor: colors[ship].backgroundColor,
      })
    }

  }
  const data = {
    datasets,
  };
  return (
    <Line
      options={{
        scales: {
          xAxes: {
            type: "time",
            time: {
              unit: "day",
              displayFormats: {
                day: 'MM/DD'
              }
            }, 
          }
        },
        responsive: true,
        interaction: {
          mode: "index" as const,
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: "平均価格の変動（毎日0時に更新）",
          },
        },
      }}
      data={data}
    />
  );
};
