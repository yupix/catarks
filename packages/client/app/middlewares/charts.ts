import { SHIPS, SHIPS_TYPE } from "~/const";
import { prisma } from "~/utils/prisma.server";

export async function getItemPriceChartById(itemId: string) {
  let dateList: number[] = [];
  // @ts-ignore
  let body: { [key in keyof typeof SHIPS_TYPE]: ItemPriceAverage[] } = {};
  for (const ship of SHIPS) {
    ship as typeof SHIPS_TYPE[keyof typeof SHIPS_TYPE];
    const price = await prisma.itemPriceAverage.findMany({
      where: {
        itemsId: itemId,
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
  return {
    body,
    dates: Array.from<Date>(_test).sort((a, b) =>
      a.getDate() > b.getDate() ? 1 : -1
    ),
  };
}
