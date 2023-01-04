export function validatePrice(price: number | null | undefined) {
  if (price == null) throw new Error("PriceNPE");
  if (validateRange({ value: price, min: 1000, max: 99999999999 })) {
    return price;
  }
  throw new Error("PriceOutOfRange");
}

export function validateRange(options: {
  value: number;
  min: number;
  max: number;
}) {
  /**
   * 与えられた範囲を用いてvalueがその範囲内に収まっているかを検証します
   * @function
   * @param { value } number - 検証する値
   * @param { min } number - 許容する最小値
   * @param { max } nubmer - 許容する最大値
   * @returns { boolean } - 範囲内ならtrue, 違うならfalse
   */
  const { max, min, value } = options;
  return min <= value && value <= max ? true : false;
}
