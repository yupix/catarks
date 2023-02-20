import type { Items } from "@catarks/db";
import type { FC } from "react";
import { getCategoryName } from "~/utils/utils";
import { Card } from "../common/Card";

type ItemCardProps = {
  classes?: {
    label: string;
    input: string;
  };
  item: Items;
};

export const ItemCard: FC<ItemCardProps> = ({ classes, item }) => {
  return (
    <Card classes={{ root: "@container" }}>
      <div className="flex items-center flex-col sm:flex-row @xs:flex-col gap-4">
        <div className="avatar">
          <div className="w-24 sm:w-16 rounded-2xl">
            <img src={item.iconUrl} alt={`${item.name} icon`} loading="lazy" />
          </div>
        </div>
        <div>
          <p className="text-gray-400 font-bold text-xs">
            {getCategoryName(item.type)}
          </p>
          <p className="font-bold ">{item.name}</p>
        </div>
      </div>
    </Card>
  );
};
