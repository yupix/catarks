import { prisma } from "#app/utils/db.server.ts";
import { replaceFuzzyWord } from "#app/utils/text-convertor.ts";
import { BaseRegister } from "#register/types/register.ts";
import { findItemByName, registerDropAria } from "#register/types/shared.ts";
import { Item, ItemDroparia, ItemTypes } from "@prisma/client";
import materials from "#register/assets/materials.json"

type TItemBase = {
  name: string;
  description: string;
  rarity: number;
};

type TItem = TItemBase & {
  droparias: { name: string }[];
  image_type?: string;
};

export class RegisterMaterials implements BaseRegister {
  createItemData(item: TItem): {
    name: string;
    fuzzyName: string;
    rarity: number;
    type: ItemTypes;
    droparias: { connect: { name: string }[] };
    iconUrl: string;
  } {
    return {
      name: item.name,
      fuzzyName: replaceFuzzyWord(item.name),
      rarity: item.rarity,
      type: "material",
      droparias: { connect: item.droparias },
      iconUrl: `https://s3.akarinext.org/catarks/*/items/materials/${
        item.image_type ? item.image_type : item.name
      }.webp`,
    };
  }

  async updateItems(item: TItem, itemId: string) {
    return await prisma.item.update({
      where: {
        id: itemId,
      },
      data: this.createItemData(item),
      include: { droparias: true },
    });
  }
  async registerItems(item: TItem) {
    return await prisma.item.create({
      data: this.createItemData(item),
      include: { droparias: true },
    });
  }

  createDocument(
    item: Item & {
      droparias: ItemDroparia[];
    }
  ) {
    return {
      id: item.id,
      name: item.name,
      iconUrl: item.iconUrl,
      droparias: item.droparias.map((droparia) => droparia.name),
      rarity: item.rarity,
      type: item.type,
    };
  }

  async run(): Promise<void> {
    const index_body = [];
    for (const item of materials) {
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
    //   const materialsIndex = new SearchService("index_materials", {
    //     SearchableAttributes: ["name"],
    //     FilterableAttributes: ["type"],
    //     sortableattributes: ["name", "createdAt"],
    //   });
    //   await materialsIndex.addDocument(index_body);
    }
  }
}