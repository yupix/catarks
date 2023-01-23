import { ItemPrices } from "@catarks/db";
import type { ActionArgs, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ItemActions } from "~/middlewares/createItemPrice";
import { authenticator } from "~/utils/auth.server";
import { assertIsDefined } from "~/utils/utils";

export type TCreateItemPriceAction = typeof action

export async function action({ request }: ActionArgs): Promise<TypedResponse<ActionResponse<'createPrice' | '?', ItemPrices>>> {
  if (request.method === 'POST') {
    const formData = await request.clone().formData()
    const user = await authenticator.authenticate('auth0', request)
    const itemId = formData.get('itemId')
    const price = formData.get('price')
    const ship = formData.get('ship')
    console.log(itemId, price, ship)
    assertIsDefined(itemId);
    assertIsDefined(price);
    assertIsDefined(ship);
    const res = await ItemActions.CreateItemPrice(itemId.toString(), Number(price.toString()), Number(ship.toString()), user)
    return json({intent: 'createPrice', status: 'success', body: res})
  }
  return json({intent: '?', status: 'failed'})
}

export async function loader() {
  return null
}