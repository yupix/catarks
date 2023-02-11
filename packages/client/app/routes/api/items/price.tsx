import type { ItemPrices } from "@catarks/db";
import type { ActionArgs, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ItemActions } from "~/middlewares/createItemPrice";
import { DeleteItemPriceById } from "~/middlewares/items";
import { authenticator } from "~/utils/auth.server";
import { assertIsDefined } from "~/utils/utils";

export type TCreateItemPriceAction = typeof action;

export async function action({
  request,
}: ActionArgs): Promise<
  TypedResponse<
    ActionResponse<
      "createPrice" | "deletePrice" | "?",
      ItemPrices | null,
      "BELOW_THE_MINIMUM_PRICE"
    >
  >
> {
  const user = await authenticator.authenticate("auth0", request);
  const formData = await request.clone().formData();
  switch (request.method) {
    case "POST": {
      const itemId = formData.get("itemId");
      const _price = formData.get("price");
      const ship = formData.get("ship");
      const useTax = formData.get("useTax");
      const qty = formData.get("qty");
      assertIsDefined(itemId);
      assertIsDefined(_price);
      assertIsDefined(ship);
      assertIsDefined(qty);
      const originalPrice = Number(_price.toString()) / Number(qty.toString());
      const price =
        useTax?.toString() === "on"
          ? originalPrice - originalPrice * 0.1
          : originalPrice;
      if (price < 1000) {
        return json({
          intent: "createPrice",
          status: "failed",
          message: "BELOW_THE_MINIMUM_PRICE",
        });
      }
      const res = await ItemActions.CreateItemPrice(
        itemId.toString(),
        price,
        Number(ship.toString()),
        user
      );
      return json({
        intent: "createPrice",
        status: "success",
        body: res,
      });
    }

    case "DELETE": {
      const priceId = formData.get("priceId");
      assertIsDefined(priceId);
      return json({
        intent: "deletePrice",
        status: "success",
        body: await DeleteItemPriceById(priceId, user),
      });
    }
  }
  return json({ intent: "?", status: "failed" });
}

export async function loader() {
  return null;
}
