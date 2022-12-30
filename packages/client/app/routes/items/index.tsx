import { Response, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HTTP_ERRORS, api } from "~/utils/utils";

export async function loader() {
  const res = await api.call('GET', '/api/items')
  const status = String(res.status) || '500'
  if (res.type === 'failed') throw new Response(`${HTTP_ERRORS.get(status)}`)
  return json(res.data)
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