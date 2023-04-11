import type { LoaderArgs } from "@remix-run/node";
import type { TypedJsonResponse } from "remix-typedjson";
import { typedjson } from "remix-typedjson";
import { getItems } from "~/middlewares/items";
import { searchParams } from "~/utils/utils";
import { validateItemQuery } from "~/validations/items/index.query";


export async function loader({
  request,
}: LoaderArgs): Promise<
  TypedJsonResponse<
    ActionResponse<"getItems", Awaited<ReturnType<typeof getItems>>>
  >
> {
  const url = searchParams(request);
  const type = url.get("type");
  const skip = url.get("skip");
  const limit = url.get("limit");
  const query = validateItemQuery.parse({
    type,
    skip,
    limit,
  });
  return typedjson({
    intent: "getItems",
    status: "success",
    body: await getItems(query),
  });
}

export type TgetItemsLoader = typeof loader;
