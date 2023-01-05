import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ItemActions } from "~/middlewares/createItemPrice";
import { assertIsDefined } from "~/utils/utils";



export async function action({ request }: ActionArgs) {
  if (request.method === 'POST') {
    const formData = await request.formData()
    const itemId = formData.get('itemId')
    const price = formData.get('price')
    const ship = formData.get('ship')
    console.log(itemId, price, ship)
    assertIsDefined(itemId);
    assertIsDefined(price);
    assertIsDefined(ship);
    const res = await ItemActions.CreateItemPrice(itemId.toString(), Number(price.toString()), Number(ship.toString()), request)
    return json(res)
  }
  return null
}

export async function loader() {
  return null
}