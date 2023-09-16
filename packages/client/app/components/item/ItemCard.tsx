import type { Items, Users } from "@catarks/db";
import { type ReactNode } from "react";
import { getCDNUrl, getCategoryName } from "~/utils/utils";
import { ItemPrice } from "./ItemPrice";
import { CopyButton } from "../CopyButton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "~/lib/utils";

type ItemCardProps = {
  classes?: {
    root: string;
    input: string;
  };
  item: Items;
  price?: number;
  reporter?: Users;
  enableCopyButton?: boolean
};

export function ItemCard({ classes, item, price, children, enableCopyButton }: ItemCardProps & { children?: ReactNode }) {
  return (
    <Card className={cn("w-[380px]", 'w-full flex items-center')} >
      <CardHeader>
        <CardTitle>
          <img
            className="h-20 w-20 rounded-md"
            src={getCDNUrl(item.iconUrl, { format: 'webp', size: '80x80' })}
            alt={`${item.name} icon`}
            loading="lazy"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%" }}>
          <div style={{ maxWidth: "calc(90%)" }}>
            <p className=" font-bold text-xs">{getCategoryName(item.type)}</p>
            <p className="font-bold cat-item-card-title flex items-center">{item.name}{enableCopyButton && <CopyButton targetValue={item.name} />}</p>
          </div>
          <div>
            {price !== undefined && <ItemPrice price={price} />}
          </div>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

ItemCard.ReportDate = function ReportDate({ children }: { children?: ReactNode }) {
  return <span className="cat-price-report-data">{children}</span>
}

ItemCard.Reporter = function Reporter({ children }: { children?: ReactNode }) {
  return <div className="cat-price-reporter">{children}</div>
}