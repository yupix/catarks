import type { Items, Users } from "@catarks/db";
import type { FC, ReactNode } from "react";
import { getCategoryName, getName } from "~/utils/utils";
import { Card } from "../common/Card";
import { ItemPrice } from "./ItemPrice";

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
      <div className="cat-item-card cat-shadow">
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
  );
};

ItemCard.ReportDate = function ReportDate({children} : {children?: ReactNode}) {
  return <span className="cat-price-report-data">{children}</span>
}

ItemCard.Reporter = function Reporter({children}: {children?: ReactNode}) {
  return <div className="cat-price-reporter">{children}</div>
}