import { Response, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getItems } from "~/middlewares/items";
import { HTTP_ERRORS, api } from "~/utils/utils";

export async function loader() {
  const items = await getItems({})
  return json(items)
}

export default function ItemsIndex() {
  const data = useLoaderData<typeof loader>()
  return (
    <>
      {data.items.map((item) => <>
        {item.name}</>
      )}
    </>
  )
}