import { Card, CardContent, CardHeader, CardTitle } from "#app/components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#app/components/ui/tabs.tsx";
import { prisma } from "#app/utils/db.server.ts";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
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
import { Line } from "react-chartjs-2";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import 'chartjs-adapter-moment';
import { ChartShipTypes, ShipTypes,ShipType, ArrayElement } from "#app/utils/const.ts";
import { ItemPriceAverage } from "@prisma/client";
import { ClientOnly } from "remix-utils/client-only";

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



export async function loader({ params }: LoaderFunctionArgs) {
    const itemId = params.itemId

    if (!itemId) {
        throw new Error('item not found')
    }

    let dateList: number[] = [];
    // @ts-ignore
    let body: { [key in keyof typeof SHIPS_TYPE]: ItemPriceAverage[] } = {};
    for (const ship of ChartShipTypes) {
      ship as ShipType;
      const price = await prisma.itemPriceAverage.findMany({
        where: {
          itemId,
          ship,
        },
      });
      body[ship] = price;
      for (const _price of price) {
        dateList.push(_price.createdAt.getTime());
      }
    }
    const _test: Date[] = [];
    for (const test of [...new Set(dateList)]) {
      _test.push(new Date(test));
    }


    return typedjson({ itemId, chartData: { body,     dates: Array.from<Date>(_test).sort((a, b) => a.getTime() - b.getTime())
    } });
}




export default function ItemPriceRoute() {
    const data = useTypedLoaderData<typeof loader>()
    const {chartData } = data

    const colors: { [key in ArrayElement<typeof ChartShipTypes>]: {
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
      let datasets: {label: string, data: ({x:Date, y:number}| null)[], backgroundColor: string}[] = [];
      for (const ship of ChartShipTypes) {
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

    return (
        <Tabs defaultValue="chart">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="price" asChild><Link to={`/items/${data.itemId}/price`}>価格履歴</Link></TabsTrigger>
                <TabsTrigger value="chart">価格の推移</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
                <Card>
                    <CardHeader>
                        <CardTitle>チャート</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ClientOnly>
                            {() => <Line
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
                            data={{
                                datasets
                            }}
                        />}
                        </ClientOnly>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}