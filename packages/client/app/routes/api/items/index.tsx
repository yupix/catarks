import { LoaderArgs, TypedResponse, json } from "@remix-run/node";
import { getItems } from "~/middlewares/items";
import { searchParams } from "~/utils/utils";
import { validateItemQuery } from "~/validations/items/index.query";

export async function loader({request}: LoaderArgs): Promise<TypedResponse<ActionResponse<'getItems', Awaited<ReturnType<typeof getItems>>>>> {
  const url = searchParams(request);
  const type = url.get("type");
  const skip = url.get("skip");
  const limit = url.get("limit");
  const query = validateItemQuery.parse({
    type,
    skip,
    limit
  })
  return json({ intent: 'getItems', status: 'success', body: await getItems(query)})
}

export type TgetItemsLoader = typeof loader