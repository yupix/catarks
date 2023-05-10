import {
  Abilities,
  AbilityEffects,
  ItemTypes,
  Items,
  PrismaClient,
} from "@catarks/db";
import { Logger } from "@catarks/shared";

import abilities from "../assets/ops.json";
import { BaseRegister } from "../types/register";
import { prisma } from "../db/session";
import { IDropAria, SearchService, registerDropAria } from "./shared";

interface IEffect {
  name: string;
  percent: boolean;
  value: number;
  types: string[];
}

const createDocument = (item: Items, ability: any) => {
  return {
    id: item.id,
    name: item.name,
    iconUrl: item.iconUrl,
    effects: ability.effects,
    droparias: ability.aria,
    rarity: item.rarity,
    type: item.type,
  };
};

export class RegisterAbility implements BaseRegister {
  orm!: PrismaClient;
  logger!: typeof Logger.getInstance
  constructor() {
    this.orm = prisma;
    this.logger = Logger.getInstance;

  }

  async getAriaNames(ariaData: IDropAria[]) {
    let ariaNames = [];
    for (const aria of ariaData.sort((a,b) => a.name.localeCompare(b.name, 'ja'))) {
      const quest_ranks = aria.quest_ranks;
      if (aria.emergency === true) {
        if (!quest_ranks) {
          ariaNames.push(`緊急クエスト「${aria.name}」`);
        } else {
          for (const quest_rank of quest_ranks) {
            ariaNames.push(`緊急クエスト「${aria.name} Rank.${quest_rank}」`);
          }
        }
      }
      if (aria.trigger === true) {
        if (!quest_ranks) {
          ariaNames.push(`Qトリガー「${aria.name}」`);
        } else {
          for (const quest_rank of quest_ranks) {
            ariaNames.push(`Qトリガー「${aria.name} Rank.${quest_rank}」`);
          }
        }
      }

      if (aria.emergency === false && aria.trigger === false) {
        if (quest_ranks) {
          for (const quest_rank of quest_ranks) {
            ariaNames.push(`${aria.name} （Rank.${quest_rank}）`)
          }
        } else {
          ariaNames.push(aria.name)
        }
      }
    }
    return ariaNames;
  }

  async registerEffect(effects: IEffect[]) {
    let effect_ids = [];
    for (const effect of effects) {
      const existsEffect = await this.orm.abilityEffects.findFirst({
        where: { name: effect.name },
      });

      const data = {
        name: effect.name,
        value: effect.value,
        percent: effect.percent,
      };

      let abilityEffect: AbilityEffects;
      if (existsEffect) {
        abilityEffect = await this.orm.abilityEffects.update({
          where: {
            name: effect.name,
          },
          data,
        });
      } else {
        abilityEffect = await this.orm.abilityEffects.create({
          data,
        });
      }
      effect_ids.push({ name: abilityEffect.name });
    }
    return effect_ids;
  }

  async registerAbility(name: string, effects: IEffect[]) {
    let ability: Abilities;
    const existsAbility = await this.orm.abilities.findFirst({
      where: {
        name,
      },
    });
    const effect_ids = await this.registerEffect(effects);
    const data = {
      name,
      effects: {
        connect: effect_ids,
      },
    };
    if (existsAbility) {
      ability = await this.orm.abilities.update({
        where: {
          name,
        },
        data,
      });
    } else {
      ability = await this.orm.abilities.create({
        data,
      });
      ability.name = name;
    }
    return { name: ability.name };
  }

  async registerOrUpdateItem(ability: TAbility, data: {
    name: string;
    rarity: number;
    type: ItemTypes;
    iconUrl: string;
    ability: {
        connect: {
          name: string;
      }
    };
    droparias: {
      connect:  {
          name: string;
      }[];
    };
}) {
  const existsItem = await this.orm.items.findFirst({
    where: { name: ability.name },
  });
  if (existsItem) {
    const item = await this.orm.items.update({
      where: {
        name: ability.name,
      },
      data,
    });
    this.logger.info(`${ability.name} is already exists. do update`);
    return item
  } else {
    // 特殊能力が存在しない
    const item = await this.orm.items.create({
      data,
    });
    this.logger.info(`successed register ${ability.name}.`);
    return item
  }
  }

  async run() {
    const index_body = [];

    for (const ability of abilities) {

      const aria_ids = await registerDropAria(
        await this.getAriaNames(ability.arias)
      );
      const ability_ids = await this.registerAbility(
        ability.name,
        ability.effects
      );
      const data = {
        name: ability.name,
        rarity: ability.rarity,
        type: "ability" as ItemTypes,
        iconUrl: `https://s3.akarinext.org/catarks/*/items/abilities/${ability.image_type}.webp`,
        ability: { connect: ability_ids },
        droparias: { connect: aria_ids },
      };
      const item = await this.registerOrUpdateItem(ability, data)
      index_body.push(createDocument(item, ability));
    }
    const abilityIndex = new SearchService("index_ops", {
      SearchableAttributes: ["name"],
      FilterableAttributes: ["type"],
      sortableattributes: ["name", "createdAt"],
    });
    await abilityIndex.addDocument(index_body)
  }
}
