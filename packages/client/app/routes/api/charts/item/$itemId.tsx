import { ItemPriceAverage } from "@catarks/db";
import { LoaderArgs, TypedResponse, json } from "@remix-run/node";
import { SHIPS, SHIPS_TYPE } from "~/const";
import { getItemPriceChartById } from "~/middlewares/charts";
import { prisma } from "~/utils/prisma.server";
import { assertIsDefined } from "~/utils/utils";

export type TGetItemPriceChart = typeof loader



export async function loader({params}: LoaderArgs): Promise<TypedResponse<ActionResponse<'getItemPriceChart', Awaited<ReturnType<typeof getItemPriceChartById>>>>> {
  const itemId = params.itemId
  assertIsDefined(itemId)

  return json({intent: 'getItemPriceChart', status: 'success', body: await getItemPriceChartById(itemId)})
}