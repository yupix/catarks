import { apiClient } from "strictcat";

export const api = apiClient<Schema>(
  "http://localhost:3000",
  "application/json"
);

export type PickType<T, K extends keyof T> = T[K];

const TYPE_TO_CATEGORY: { [key in PickType<ItemDto, "type">]: string } = {
  ability: "特殊能力",
  weapon: "武器",
};

export const getCategoryName = (type: PickType<ItemDto, "type">): string => {
  return TYPE_TO_CATEGORY[type];
};

export const HTTP_ERRORS = new Map<string, { content: string }>([
  ["400", { content: "Bad Request" }],
  ["401", { content: "Unauthorized" }],
  ["402", { content: "Payment Required " }],
  ["403", { content: "Forbidden" }],
  ["404", { content: "Not Found" }],
  ["405", { content: "Method Not Allowed" }],
  ["406", { content: "Not Acceptable" }],
  ["407", { content: "Proxy Authentication Required" }],
  ["500", { content: "Internal Server Error" }],
  ["501", { content: "Not Implemented" }],
  ["502", { content: "Bad Gateway" }],
]);

export const getPaginationPageNumber = (options: {
  page: string | number;
  limit: number;
}) => {
  return options.page === "0" || options.page === "1"
    ? 0
    : options.limit * (Number(options.page) - 1);
};

export const invariant = (status: boolean, message: string) => {
  if (status === false) throw new Error(message);
};
