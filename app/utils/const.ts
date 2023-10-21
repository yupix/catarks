export type PickType<T, K extends keyof T> = T[K];

export type ObjectValues<T> = T[keyof T]

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

export const ShipTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const ChartShipTypes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type ShipType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const assertIsShip = (value: unknown): value is ShipType => {
  return typeof value !== "number" ? false : true;
};

export const ITEM_TYPES = ['ability', 'weapon', 'armor', 'material'] as const
export type ITEM_TYPE = ArrayElement<typeof ITEM_TYPES>

export const TYPE_TO_CATEGORY: { [key in ITEM_TYPE]: string } = {
  ability: "特殊能力",
  weapon: "武器",
  armor: '防具',
  material: "素材"
};