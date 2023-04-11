import type { Items } from "@catarks/db";
import type { LoaderArgs } from "@remix-run/node";
import type { TypedJsonResponse } from "remix-typedjson";
import { typedjson } from "remix-typedjson";
import { prisma } from "~/utils/prisma.server";
import { assertIsDefined } from "~/utils/utils";

export type TGetItemByIdLoader = typeof loader;
export async function loader({
  params,
}: LoaderArgs): Promise<
  TypedJsonResponse<ActionResponse<"getItemById", Items>>
> {
  const itemId = params.itemId;
  assertIsDefined(itemId);
  const item = await prisma.items.findFirst({ where: { id: itemId } });
  if (!item) throw new Error("NotFound");
  return typedjson({
    intent: "getItemById",
    status: "success",
    body: item,
  });
}
