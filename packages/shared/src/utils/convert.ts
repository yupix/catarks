import { PickType } from "./type";

export const TYPE_TO_CATEGORY: { [key in PickType<ItemDto, "type">]: string } =
  {
    ability: "特殊能力",
    weapon: "武器",
  };

export const CREATE_URL = (domain: string, ssl: boolean, path?: string) => {
  return `${ssl ? "https" : "http"}://${domain}/${path}`;
};
