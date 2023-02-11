import type { Items } from "@catarks/db";
import type { ITEM_TYPE } from "@catarks/utils";
import type { SearchResponse } from "meilisearch";
import type { SearchItemQuery } from "~/validations/search/item.query";
import { SearchClient } from "~/utils/search.server";

const CategoryToIndexMapping: {[key in ITEM_TYPE]: string} = {
  "ability": "index_ops",
  "weapon": "index_ops",
  "armor": "index_ops",
}

export async function SearchItemByQuery(query: SearchItemQuery): Promise<SearchResponse<Items>> {
  const itemIndex = await SearchClient.getIndex(CategoryToIndexMapping[query.category])
   const items = await itemIndex.search<Items>(query.q, {limit: query.limit, offset: query.skip, filter: [`type = ${query.category}`], sort: ["title:asc"]})
   return items
}