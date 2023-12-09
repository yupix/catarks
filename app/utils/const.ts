export type PickType<T, K extends keyof T> = T[K]

export type ObjectValues<T> = T[keyof T]

export type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType[number]

export const ShipTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
export const ChartShipTypes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
export type ShipType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const ItemRarities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
export type ItemRarity = keyof typeof ItemRarities

export const assertIsShip = (value: unknown): value is ShipType => {
	return typeof value !== 'number' ? false : true
}

export const ITEM_TYPES = ['ability', 'weapon', 'armor', 'material'] as const
export type ITEM_TYPE = ArrayElement<typeof ITEM_TYPES>

export const TYPE_TO_CATEGORY: { [key in ITEM_TYPE]: string } = {
	ability: '特殊能力',
	weapon: '武器',
	armor: '防具',
	material: '素材',
}

export const ATTACK_ELEMENTS = [
	'normalAtk',
	'fireElementAtk',
	'iceElementAtk',
	'LightningElementAtk',
	'windElementAtk',
	'lightElementAtk',
	'darkElementAtk',
] as const

export const ATTACK_ELEMENT_TO_NAME: { [key in ATTACK_ELEMENT]: string } = {
	fireElementAtk: '火属性',
	iceElementAtk: '氷属性',
	LightningElementAtk: '雷属性',
	windElementAtk: '風属性',
	lightElementAtk: '光属性',
	darkElementAtk: '闇属性',
	normalAtk: '通常',
}

export const WEAPON_RARITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export type ATTACK_ELEMENT = ArrayElement<typeof ATTACK_ELEMENTS>

export const WEAPON_TYPES = [
	'Swords',
	'Wired Lance',
	'Partizan',
	'Twin Daggers',
	'Double Saber',
	'Knuckles',
	'Katana',
	'Dual Blades',
	'Assault Rifle',
	'Launcher',
	'Twin Machineguns',
	'Bullet Bow',
	'Gunslash',
	'Rod',
	'Talis',
	'Wand',
	'Jet Boots',
	'Takt',
] as const

export type WEAPON_TYPE = ArrayElement<typeof WEAPON_TYPES>
