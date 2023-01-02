import { api, createAuthHeaders } from "~/utils/utils";

export class ItemActions {

  static async CreateItemPrice(itemId: string, price: number, ship: number, request: Request) {
    /**
     * アイテムの価格を作成します
     * @static
     * @async
     * @param {string} itemid - Item id
     * @param {number} price - item price
     * @param {number} ship - ship number
     * @returns {CreatedItemPriceDto} - created item price
     * @throws {Error}
     */
    const headers = await createAuthHeaders(request)
    headers.append('Content-Type', 'application/json')

    const res = await api.call('POST', '/api/items/:itemId/price', { body: { ship, price }, params: { itemId }, headers })

    if (res.type === 'failed') throw new Error(JSON.stringify(res.data))
    return res.data
  }
}