import { Users } from "@catarks/db";
import { ORM } from "@/db/session.js";
import { validateRange } from "@/utils/validate.js";
import { OutOfRangeError } from "@/exceptions.js";
import { api } from "@/utils/api.js";

export class ItemPriceActions {
  static async register(options: {
    itemId: string;
    ship: number;
    price: number;
    reporterId: string;
  }) {
    /**
     * @static
     * @async
     * @param { itemId } string - アイテムのId
     * @param { price } number - 値段
     * @param { ship } number - 報告する価格のship番号
     * @param { reporterId } Users - 報告者のId
     * @returns { Promise<ItemPrices> } - 作成した価格
     * @throws { OutOfRangeError } - 価格が範囲外になっている
     */

    const { itemId, price, reporterId, ship } = options;
    if (validateRange({ value: price, min: 1000, max: 99999999999 }))
      throw new OutOfRangeError("アイテムの価格が範囲内に収まっていません");

    return await ORM.instance().itemPrices.create({
      data: {
        reporter: { connect: { id: reporterId } },
        price,
        item: { connect: { id: itemId } },
        ship,
      },
    });
  }
}

export async function getItemIdfromPrice(itemId: string, limit?: number) {
  const res = await api.call("GET", "/api/items/:itemId/price", {
    params: { itemId },
    query: { limit },
  });

  if (res.type === "failed") throw new Error(JSON.stringify(res.data));
  return res.data;
}
