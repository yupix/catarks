import { ItemTypes } from "@catarks/db";
import { TYPE_TO_CATEGORY } from "@catarks/utils";
import { apiClient } from "strictcat";
import { authenticator } from "~/utils/auth.server";

export const api = apiClient<Schema>("https://api.catarks.org", {
  contentType: "application/json",
});


export const searchParams = (request: Request) => {
  const url = new URL(request.url);
  const get = (key: string) => {
    return url.searchParams.get(key) || undefined
  }
  return {get}
}

export const getCategoryName = (type: ItemTypes): string => {
  return TYPE_TO_CATEGORY[type];
};

export const createAuthHeaders = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request);
  assertIsDefined(user);
  return { Cookie: user.session };
};

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}
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
