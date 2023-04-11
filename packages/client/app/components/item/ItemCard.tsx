import type { Items, Users } from "@catarks/db";
import { type ReactNode } from "react";
import { getCategoryName } from "~/utils/utils";
import { ItemPrice } from "./ItemPrice";
import { Card } from "../common/Card";

type ItemCardProps = {
  classes?: {
    root: string;
    input: string;
  };
  item: Items;
  price?: number;
  reporter?: Users;
};

export function ItemCard({ classes, item, price, children }: ItemCardProps &{ children?: ReactNode}) {
  return (
    <Card classes={{root: "@container"}}>
      <div className="grid grid-cols-1 @sm:grid-cols-2 justify-items-center">
        <div>
          <img
            className="cat-item-icon"
            src={item.iconUrl}
            alt={`${item.name} icon`}
            loading="lazy"
          />
        </div>
        <div style={{width: "100%"}}>
          <div style={{maxWidth: "calc(90%)"}}>
            <p className=" font-bold text-xs">{getCategoryName(item.type)}</p>
            <p className="font-bold cat-item-card-title">{item.name}</p>
          </div>
          <div>
            {price !== undefined && <ItemPrice price={price}/>}
          </div>
          {children}
        </div>
        
      </div>
      </Card>
  );
};

ItemCard.ReportDate = function ReportDate({children} : {children?: ReactNode}) {
  return <span className="cat-price-report-data">{children}</span>
}

ItemCard.Reporter = function Reporter({children}: {children?: ReactNode}) {
  return <div className="cat-price-reporter">{children}</div>
}