
  
  import { type Ability, type AbilityEffect, type Item, type ItemTypes, type PrismaClient } from "@prisma/client";
import { prisma } from "#app/utils/db.server.ts";
import { replaceFuzzyWord } from "#app/utils/text-convertor.ts";
import { type IDropAria, type TAbility, registerDropAria } from "#register/types/shared.ts";
import abilities from "../assets/ops.json";
  import { type BaseRegister } from "../types/register.ts";
  
  interface IEffect {
    name: string;
    percent: boolean;
    value: number;
    types: string[];
  }
  
  const createDocument = (item: Item, ability: any) => {
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
    constructor() {
      this.orm = prisma;
  
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
        const existsEffect = await this.orm.abilityEffect.findFirst({
          where: { name: effect.name },
        });
  
        const data = {
          name: effect.name,
          value: effect.value,
          percent: effect.percent,
        };
  
        let abilityEffect: AbilityEffect;
        if (existsEffect) {
          abilityEffect = await this.orm.abilityEffect.update({
            where: {
              name: effect.name,
            },
            data,
          });
        } else {
          abilityEffect = await this.orm.abilityEffect.create({
            data,
          });
        }
        effect_ids.push({ name: abilityEffect.name });
      }
      return effect_ids;
    }
  
    async registerAbility(name: string, effects: IEffect[], itemId: string) {
      let ability: Ability;
      const existsAbility = await this.orm.ability.findFirst({
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
        ability = await this.orm.ability.update({
          where: {
            name,
          },
          data,
        });
      } else {
        ability = await this.orm.ability.create({
          data: {...data, itemId},
          
        });
        ability.name = name;
      }
      return { name: ability.name };
    }
  
    async registerOrUpdateItem(ability: TAbility, data: {
      name: string;
      fuzzyName: string;
      rarity: number;
      type: ItemTypes;
      iconUrl: string;

      droparias: {
        connect:  {
            name: string;
        }[];
      };
  }) {
    const existsItem = await this.orm.item.findFirst({
      where: { name: ability.name },
    });
    if (existsItem) {
      const item = await this.orm.item.update({
        where: {
          name: ability.name,
        },
        data,
      });
      console.info(`${ability.name} is already exists. do update`);
      return item
    } else {
      // 特殊能力が存在しない
      const item = await this.orm.item.create({
        data,
      });
      console.info(`successed register ${ability.name}.`);
      return item
    }
    }
  
    async run() {
      const index_body = [];
  
      for (const ability of abilities) {
  
        const aria_ids = await registerDropAria(
          await this.getAriaNames(ability.arias)
        );
        const data = {
          name: ability.name,
          fuzzyName: replaceFuzzyWord(ability.name),
          rarity: ability.rarity,
          type: "ability" as ItemTypes,
          iconUrl: `https://s3.akarinext.org/catarks/*/items/abilities/${ability.image_type}.webp`,
          // ability: { connect: ability_ids },
          droparias: { connect: aria_ids },
        };

        const item = await this.registerOrUpdateItem(ability, data)
        await this.registerAbility(
          ability.name,
          ability.effects,
          item.id
        );
        index_body.push(createDocument(item, ability));
      }
      // const abilityIndex = new SearchService("index_ops", {
      //   SearchableAttributes: ["name"],
      //   FilterableAttributes: ["type"],
      //   sortableattributes: ["name", "createdAt"],
      // });
      // await abilityIndex.addDocument(index_body)
    }
  }
  