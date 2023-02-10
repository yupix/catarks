import type { ITEM_TYPE } from "@catarks/utils";
import type { LoaderArgs } from "@remix-run/node";
import { SearchClient } from "~/utils/search.server";
import { searchParams } from "~/utils/utils";
import { validateSearchItemQuery } from "~/validations/search/item.query";

const CategoryToIndexMapping: {[key in ITEM_TYPE]: string} = {
  "ability": "index_ops",
  "weapon": "index_ops",
  "armor": "index_ops",
}

export async function loader({request}: LoaderArgs) {
  const params = searchParams(request)
  const category = params.get('category')
  const skip = params.get("skip");
  const limit = params.get("limit");
  const q = params.get("q");
  const query = validateSearchItemQuery.parse({
    category,
    skip,
    limit,
    q
  })
  const itemIndex = await SearchClient.getIndex(CategoryToIndexMapping[query.category])
  const items = await itemIndex.search(query.q, {limit: query.limit, offset: query.skip})
  return items
}