import { Item } from "@prisma/client";
import { NIcon } from "./n-icon.tsx";
import { TYPE_TO_CATEGORY } from "#app/utils/const.ts";

interface Props {
  item: Item
  nowPrice?: number
}

export function ItemCard({ item, nowPrice }: Props) {
  return (
    <div className="grid grid-cols-4 border rounded-md p-2">
      <div>
        <img
          className="h-20 w-20 rounded-md"
          src={item.iconUrl}
          alt={`${item.name} icon`}
          loading="lazy"
        />
      </div>
      <div style={{ width: "100%" }} className="col-span-3">
        <div style={{ maxWidth: "calc(90%)" }}>
          <p className=" font-bold text-xs">{TYPE_TO_CATEGORY[item.type]}</p>
          <p className="font-bold cat-item-card-title flex items-center">{item.name}</p>
          {nowPrice ? <p className="flex -center"><NIcon />{nowPrice}</p> : null}
        </div>
      </div>

    </div>
  )
}