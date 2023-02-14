import { BaseRegister } from "@/types/register";
import items from "../assets/materials.json";
import { prisma } from "../db/session";
import { Indexer, findItemByName, registerDropAria } from "./shared";
import { DropArias, ItemTypes, Items } from "@catarks/db";

type TItemBase = {
  name: string;
  description: string;
  rarity: number;
};

type TItem = TItemBase & {
  droparias: { name: string }[];
};

export class RegisterMaterials implements BaseRegister {
  createItemData(item: TItem): {
    name: string;
    rarity: number;
    type: ItemTypes;
    droparias: { connect: { name: string }[] };
    iconUrl: string;
  } {
    return {
      name: item.name,
      rarity: item.rarity,
      type: "material",
      droparias: { connect: item.droparias },
      iconUrl: `https://s3.akarinext.org/assets/*/pso2/items/material/${item.name}.webp`,
    };
  }

  async updateItems(item: TItem, itemId: string) {
    return await prisma.items.update({
      where: {
        id: itemId,
      },
      data: this.createItemData(item),
      include: { droparias: true },
    });
  }
  async registerItems(item: TItem) {
    return await prisma.items.create({
      data: this.createItemData(item),
      include: { droparias: true },
    });
  }

  createDocument(
    item: Items & {
      droparias: DropArias[];
    }
  ) {
    return {
      id: item.id,
      title: item.name,
      iconUrl: item.iconUrl,
      droparias: item.droparias.map((droparia) => droparia.name),
      rarity: item.rarity,
      type: item.type,
    };
  }

  async run(): Promise<void> {
    const index_body = [];
    for (const item of items) {
      const droparias = await registerDropAria(item.droparias);
      const checkItem = await findItemByName(item.name);
      if (checkItem) {
        const _item = await this.updateItems(
          { ...item, droparias },
          checkItem.id
        );
        index_body.push(this.createDocument(_item));
      } else {
        const _item = await this.registerItems({ ...item, droparias });
        index_body.push(this.createDocument(_item));
      }
      await Indexer("index_materials", index_body, {
        FilterableAttributes: ["type"],
        sortableattributes: ["title"],
      });
    }
  }
}
