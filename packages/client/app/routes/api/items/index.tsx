import { LoaderArgs, json } from "@remix-run/node";
import { ITEM_TYPE, ITEM_TYPES } from "~/const";
import { getItems } from "~/middlewares/items";
import { prisma } from "~/utils/prisma.server";
import { assertIsDefined, searchParams } from "~/utils/utils";
import { validateItemQuery } from "~/validations/items/index.query";

export async function loader({request}: LoaderArgs) {
  const url = searchParams(request);
  const type = url.get("type");
  const skip = url.get("skip");
  const limit = url.get("limit");
  const query = validateItemQuery.parse({
    type,
    skip,
    limit
  })
  return json(await getItems(query))
}
