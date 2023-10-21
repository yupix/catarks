
/**
 * @param price 税込み価格
 * @param useTax 税抜き価格を計算するかどうか
 * @returns number
 * @description 自動で税抜き価格を計算します。
 */
export async function calcPrice(price: number, useTax: boolean) {
    return useTax ? price - (price * 0.1) : price;
}