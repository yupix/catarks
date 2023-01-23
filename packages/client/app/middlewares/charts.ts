import { SHIPS, SHIPS_TYPE } from "~/const"
import { prisma } from "~/utils/prisma.server"

export async function getItemPriceChartById(itemId: string) {
  let dateList = new Set<Date>()
    // @ts-ignore
    let body: {[key in keyof typeof SHIPS_TYPE]: ItemPriceAverage[]} = {}
    for (const ship of SHIPS) {
      ship as typeof SHIPS_TYPE[keyof typeof SHIPS_TYPE]
      const price = await prisma.itemPriceAverage.findMany({where: {
        itemsId: itemId,
        ship
      }})
      body[ship] = price
      for (const _price of price) {
        dateList.add(_price.createdAt)
      }
    }
    return {body, dates: Array.from<Date>(dateList).sort((a, b) => a.getDate() > b.getDate() ? 1: -1)}
}