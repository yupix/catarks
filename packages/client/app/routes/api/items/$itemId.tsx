import type { Items } from "@catarks/db";
import type { LoaderArgs, TypedResponse} from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { assertIsDefined } from "~/utils/utils";

export type TGetItemByIdLoader = typeof loader
export async function loader({
  params,
}: LoaderArgs): Promise<TypedResponse<ActionResponse<"getItemById", Items>>> {
  const itemId = params.itemId;
  assertIsDefined(itemId);
  const item = await prisma.items.findFirst({ where: { id: itemId } });
  if (!item) throw new Error("NotFound");
  return json({
    intent: "getItemById",
    status: "success",
    body: item,
  });
}
