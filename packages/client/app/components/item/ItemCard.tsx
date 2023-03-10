import type { Items } from "@catarks/db";
import type { FC } from "react";
import { getCategoryName } from "~/utils/utils";
import { Card } from "../common/Card";
import { ItemPrice } from "./ItemPrice";

type ItemCardProps = {
  classes?: {
    label: string;
    input: string;
  };
  item: Items;
  price?: number;
};

export const ItemCard: FC<ItemCardProps> = ({ classes, item, price }) => {
  return (
    <Card classes={{ root: "@container", body: "bg-base-100" }}>
      <div className="cat-item-card">
        <div>
          <img
            className="cat-item-icon"
            src={item.iconUrl}
            alt={`${item.name} icon`}
            loading="lazy"
          />
        </div>
        <div>
          <div>
            <p className=" font-bold text-xs">{getCategoryName(item.type)}</p>
            <p className="font-bold">{item.name}</p>
          </div>
          <div>
            {price !== undefined && <ItemPrice price={price}/>}
          </div>
        </div>
      </div>
    </Card>
  );
};
