import type { LoaderArgs } from "@remix-run/node";
import { SearchItemByQuery } from "~/middlewares/search";
import { searchParams } from "~/utils/utils";
import { validateSearchItemQuery } from "~/validations/search/item.query";

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
  
  return await SearchItemByQuery(query)
}