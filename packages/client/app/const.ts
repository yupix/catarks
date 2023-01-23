export const AUTHORS = ["yupix", "ikaros", "Alumis", "aki"];
export const ITEM_TYPES = ['ability', 'weapon', 'armor'] as const
export type ITEM_TYPE = ObjectValues<typeof ITEM_TYPES>
