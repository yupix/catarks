import type { ItemPrices } from "@catarks/db";
import type { ActionArgs } from "@remix-run/node";
import type { TypedJsonResponse } from "remix-typedjson";
import { typedjson } from "remix-typedjson";
import { DeleteItemPriceById } from "~/middlewares/items";
import { PriceRepository } from "~/repository/price";
import { authenticator } from "~/utils/auth.server";
import {
  validatePriceCreate,
  validatePriceDelete,
} from "~/validations/items/price";

export type TCreateItemPriceAction = typeof action;

export async function action({
  request,
}: ActionArgs): Promise<
  TypedJsonResponse<
    | ActionResponse<
      "createPrice",
      AwaitedReturnType<typeof PriceRepository.createItemPrice>,
      "BELOW_THE_MINIMUM_PRICE" | "INVALID_PRICE"
    >
    | ActionResponse<"deletePrice", ItemPrices>
    | ActionResponse<"?", null>
  >
> {
  const user = await authenticator.authenticate("auth0", request);
  const formData = await request.clone().formData();
  switch (request.method) {
    case "POST": {
      const itemId = formData.get("itemId")?.toString();
      const _price = formData.get("price")?.toString();
      const ship = formData.get("ship")?.toString();
      const useTax = formData.get("useTax")?.toString();
      const qty = formData.get("qty")?.toString();
      const body = validatePriceCreate.parse({
        itemId,
        price: _price,
        ship,
        useTax,
        qty,
      });
      const originalPrice = body.price / body.qty;
      console.log(body.useTax, "これがtax");
      const price =
        body.useTax === "on"
          ? originalPrice - originalPrice * 0.1
          : originalPrice;
      if (price % 100 !== 0) {
        return typedjson({
          intent: "createPrice",
          status: "failed",
          message: "INVALID_PRICE",
        });
      }
      if (
        (price < 900 && body.useTax === "on") ||
        (price < 900 && body.useTax !== "on")
      ) {
        return typedjson({
          intent: "createPrice",
          status: "failed",
          message: "BELOW_THE_MINIMUM_PRICE",
        });
      }
      const res = await PriceRepository.createItemPrice(
        body.itemId,
        price,
        body.ship,
        user
      );
      return typedjson({
        intent: "createPrice",
        status: "success",
        body: res,
      });
    }

    case "DELETE": {
      const priceId = formData.get("priceId")?.toString();
      const body = validatePriceDelete.parse({
        priceId,
      });
      return typedjson({
        intent: "deletePrice",
        status: "success",
        body: await DeleteItemPriceById(body.priceId, user),
      });
    }
  }
  return typedjson({ intent: "?", status: "failed" });
}

export async function loader() {
  return null;
}
