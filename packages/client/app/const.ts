import {UserRoles, UserSettings, UserShortCuts, Users} from "@catarks/db";
export const AUTHORS = ["yupix", "ikaros", "Alumis", "aki"];
export const SITE_META_PREFIX = "CatArks";
export const SHIPS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const SHIPS_TYPE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const ALLOWED_IMAGE_TYPES = ['png', 'jpeg', 'webp', 'svg', 'gif', "jpg"]
export type TUserSession = {user: Users & {
  settings: UserSettings | null, role: UserRoles[], UserShortCut: UserShortCuts[];
}}

export const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
] as const;

export const CATEGORIES = [
  {
    title: "特殊能力",
    value: "ability",
    icon: "https://s3.akarinext.org/assets/*/pso2/op/op_10.webp",
  },
  {
    title: "武器",
    value: "weapon",

    icon: "https://s3.akarinext.org/assets/*/pso2/items/weapons/ネオス・アストリオンセイバー.webp",
  },
  {
    title: "防具",
    value: "armor",
    icon: "https://s3.akarinext.org/assets/*/pso2/items/armors/エイジャクスアーマ.webp",
  },
  {
    title: "素材",
    value: "material",
    icon: "https://s3.akarinext.org/assets/*/pso2/items/material/ストラグメントA.webp",
  },
];
