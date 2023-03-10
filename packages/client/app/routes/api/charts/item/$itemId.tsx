import type { LoaderArgs, TypedResponse} from "@remix-run/node";
import { typedjson } from "remix-typedjson";
import { getItemPriceChartById } from "~/middlewares/charts";
import { assertIsDefined } from "~/utils/utils";

export type TGetItemPriceChart = typeof loader



export async function loader({params}: LoaderArgs): Promise<TypedResponse<ActionResponse<'getItemPriceChart', Awaited<ReturnType<typeof getItemPriceChartById>>>>> {
  const itemId = params.itemId
  assertIsDefined(itemId)

  return typedjson({intent: 'getItemPriceChart', status: 'success', body: await getItemPriceChartById(itemId)})
}