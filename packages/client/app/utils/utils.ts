import type { ItemTypes, Users } from "@catarks/db";
import { TYPE_TO_CATEGORY } from "@catarks/utils";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import { TUserSession } from "~/const";

export function getName(user: Users) {
  return user.nickname ? user.nickname : user.username;
}
export function isUUID(uuid?: string) {
  if (!uuid) return false;
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uuid);
}

export function getCDNUrl(
  link: string,
  options: { format: "webp" | 'png' | 'jpg'; size: string }
) {
  return `https://cdn.catarks.org/unsafe/${options.size}/filters:format(${options.format})/${link}`;
}

export function NotNullableFormData(formData: FormData) {
  const get = (key: string) => {
    return formData.get(key) || undefined;
  };
  return { get };
}

export function searchParams(request: Request) {
  const url = new URL(request.url);
  const get = (key: string) => {
    return url.searchParams.get(key) || undefined;
  };
  return { get };
}

export const getCategoryName = (type: ItemTypes): string => {
  return TYPE_TO_CATEGORY[type];
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

export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data;
}

function isUser(user: any): user is TUserSession {
  return user && typeof user === "object";
}

export function useOptionalUser(): TUserSession | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data)) {
    return undefined;
  }
  return data;
}

export function useUser(): TUserSession {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}