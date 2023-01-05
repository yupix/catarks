import { ORM } from "@/db/session.js";
import { Items } from "@catarks/db";

/**
 * @static
 * @async
 * @function
 * @param { id } string - 取得するアイテムのId
 * @returns { (Items | null) } - アイテム、存在しない場合はnull
 */
export class ItemActions {
  static async getfromId(id: string): Promise<Items | null> {
    return await ORM.instance().items.findFirst({
      where: {
        id,
      },
    });
  }
}
