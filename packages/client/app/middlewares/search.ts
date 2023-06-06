import type { Items } from "@catarks/db";
import type { ITEM_TYPE } from "@catarks/utils";
import type { SearchResponse } from "meilisearch";
import type { SearchItemQuery } from "~/validations/search/item.query";
import { SearchClient } from "~/utils/search.server";
import { ItemRepository } from "~/repository/item";

type TSearchResponse <T> =  {
  hits: T;
  estimatedTotalHits: number | undefined;
} 

const CategoryToIndexMapping: { [key in ITEM_TYPE]: string } = {
  ability: "index_ops",
  weapon: "index_ops",
  armor: "index_ops",
  material: "index_materials",
};

export async function SearchItemByQuery(
  query: SearchItemQuery
) {
  const itemIndex = await SearchClient.getIndex(
    CategoryToIndexMapping[query.category]
  );
  const rawItems = await itemIndex.search<{id: string}>(query.q, {
    sort: ["name:asc"],
    matchingStrategy: "all",
    attributesToRetrieve: ["id"],
    offset: query.skip,
    filter: [`type = ${query.category}`],
    limit: query.limit,
  });
  let items = []
  for (const itemId of rawItems.hits) {
    const item = await ItemRepository.findById(itemId.id, {include: {prices: true}, includePriceAverage: query.include_price_average})
    if (!item) continue
    items.push(item)
  }
  return {hits: items, estimatedTotalHits: rawItems.estimatedTotalHits};
}
