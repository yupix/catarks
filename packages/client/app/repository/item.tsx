import { Items, Prisma, ItemPriceAverage  } from "@catarks/db";
import { PickType } from "@catarks/utils";
import { prisma } from "~/utils/prisma.server";

export class ItemRepository {
  static async findById(id: string, options?: {include?: PickType<Prisma.ItemsFindFirstArgs, 'include'>, includePriceAverage?: boolean}){
    const item = await prisma.items.findFirst({
      where: { id },
      include: options?.include
    });
    if (item === null) return null
    if (options?.includePriceAverage) {
      const priceAverage = await prisma.itemPriceAverage.findFirst({distinct: 'itemsId', where: {itemsId: id}, orderBy: {createdAt: 'desc'}})
      console.log(priceAverage)
      return {...item, priceAverage: priceAverage ? priceAverage.price : undefined}
    }
    return {...item, priceAverage: undefined}
  }
  static async findManyByAriaName(name: string) {
    const items = await prisma.items.findMany({
      where: {
        droparias: {
          some: {
            name,
          },
        },
      },
    });
    return items;
  }
}
