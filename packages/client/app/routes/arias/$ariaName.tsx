import type { LoaderArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ItemCard } from "~/components/item/ItemCard";
import { ItemRepository } from "~/repository/item";

export async function loader({params}: LoaderArgs ) {
  if (!params.ariaName) throw Error('ariaName not found')
  const items = await ItemRepository.findManyByAriaName(params.ariaName)
  return typedjson({items, ariaName: params.ariaName})
}

export default function AriaName () {
  const {items, ariaName} = useTypedLoaderData<typeof loader>()
  return (
    <div>
      <section>
        <h1 className="text-2xl font-bold text-center">{ariaName} で入手できるアイテム</h1>
      </section>
      <div className="mt-5 grid justify-center grow grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-3">
        {items.sort((a,b) => a.name.localeCompare(b.name, 'ja')).map((item) => <ItemCard item={item} key={item.id}/>)}
      </div>
    </div>
  )
}