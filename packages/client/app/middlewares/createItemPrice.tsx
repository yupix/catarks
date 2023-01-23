import { ItemPrices, Users } from "@catarks/db";
import { prisma } from "~/utils/prisma.server";

export class ItemActions {

  static async CreateItemPrice(itemId: string, price: number, ship: number, user: Users): Promise<ItemPrices> {
    /**
     * アイテムの価格を作成します
     * @static
     * @async
     * @param {string} itemid - Item id
     * @param {number} price - item price
     * @param {number} ship - ship number
     * @returns {ItemPrices} - created item price
     */
    return await prisma.itemPrices.create({data: {
      price,
      itemId,
      ship,
      reporterId: user.id
    }})
  }
}