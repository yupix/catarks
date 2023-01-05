import { ORM } from "@/db/session.js";

export class ItemActions {
  static async getfromId(id: string) {
    /**
     * @static
     * @async
     * @function
     * @param { id } string - 取得するアイテムのId
     * @returns { Items | null } - アイテム、存在しない場合はnull
     */

    return await ORM.instance().items.findFirst({
      where: {
        id,
      },
    });
  }
}
