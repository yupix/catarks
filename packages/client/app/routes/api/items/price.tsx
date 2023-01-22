import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ItemActions } from "~/middlewares/createItemPrice";
import { authenticator } from "~/utils/auth.server";
import { assertIsDefined } from "~/utils/utils";



export async function action({ request }: ActionArgs) {
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
    return json(res)
  }
  return null
}

export async function loader() {
  return null
}