import { Users } from "@catarks/db";
import { prisma } from "~/utils/prisma.server";

export class PriceRepository {
  static async createItemPrice(itemId: string, price: number, ship: number, user: Users) {
    /**
     * アイテムの価格を作成します
     * @static
     * @async
     * @param {string} itemid - Item id
     * @param {number} price - item price
     * @param {number} ship - ship number
     */
    return await prisma.itemPrices.create({
      data: {
        price,
        itemId,
        ship,
        reporterId: user.id
      },
      include: {item: true}
    })
  }

  static async getPriceCount() {
    return await prisma.itemPrices.count()
  }
}