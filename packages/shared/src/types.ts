export const ShipTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type ShipType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const assertIsShip = (value: unknown): value is ShipType => {
  return typeof value !== "number" ? false : true;
};
