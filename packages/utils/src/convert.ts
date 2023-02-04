import { ArrayElement } from "./type";

export const ITEM_TYPES = ['ability', 'weapon', 'armor'] as const
export type ITEM_TYPE = ArrayElement<typeof ITEM_TYPES>

export const TYPE_TO_CATEGORY: { [key in ITEM_TYPE]: string } = {
  ability: "特殊能力",
  weapon: "武器",
  armor: '防具'
};


export const CREATE_URL = (domain: string, ssl: boolean, path?: string) => {
  return `${ssl ? "https" : "http"}://${domain}${path ? `/${path}` : ""}`;
};

export const StringToBoolean = (text: string) => {
  return text === 'true' ? true : false
}