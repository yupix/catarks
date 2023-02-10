import {
  Abilities,
  AbilityEffects,
  DropArias,
  Items,
  PrismaClient,
} from "@catarks/db";
import { Logger, config } from "@catarks/shared";
import abilities from "../assets/ops.json";
import { ORM } from "../db/session";
import { BaseRegister } from "../types/register";
import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: config.meilisearch.host,
  apiKey: config.meilisearch.apikey,
});

interface IEffect {
  name: string;
  percent: boolean;
  value: number;
  types: string[];
}

const createDocument = (item: Items, ability: any) => {
  return {
    id: item.id,
    title: item.name,
    iconUrl: item.iconUrl,
    effects: ability.effects,
    droparias: ability.aria,
    rarity: item.rarity,
    type: item.type
  }
}

export class RegisterAbility implements BaseRegister {
  orm!: PrismaClient;
  constructor() {
    this.orm = ORM.instance();
  }

  async registerEffect(effects: IEffect[]) {
    let effect_ids = [];
    for (const effect of effects) {
      const existsEffect = await this.orm.abilityEffects.findFirst({
        where: { name: effect.name },
      });

      let abilityEffect: AbilityEffects;
      if (existsEffect) {
        abilityEffect = existsEffect;
      } else {
        abilityEffect = await this.orm.abilityEffects.create({
          data: {
            name: effect.name,
            value: effect.value,
            percent: effect.percent,
          },
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
    if (existsAbility) {
      ability = existsAbility;
    } else {
      const effect_ids = await this.registerEffect(effects);
      ability = await this.orm.abilities.create({
        data: {
          name,
          effects: {
            connect: effect_ids,
          },
        },
      });
      ability.name = name;
    }
    return { name: ability.name };
  }

  async registerDropAria(aries: string[]) {
    let droparias = [];
    for (const aria of aries) {
      const hitAria = await this.orm.dropArias.findFirst({
        where: {
          name: aria,
        },
      });
      if (hitAria === null) {
        const createdAria = await this.orm.dropArias.create({
          data: {
            name: aria,
          },
        });
        droparias.push({ name: createdAria.name });
      } else {
        droparias.push({ name: hitAria.name });
      }
    }
    return droparias;
  }

  async run() {
    const index_body = [];
    for (const ability of abilities) {
      const logger = Logger.getInstance;
      const existsItem = await this.orm.items.findFirst({
        where: { name: ability.name },
      });
      if (existsItem) {
        logger.info(`${ability.name} is already exists. skip`);
        index_body.push(createDocument(existsItem, ability));
        continue;
      }
      const aria_ids = await this.registerDropAria(ability.aria);
      const ability_ids = await this.registerAbility(
        ability.name,
        ability.effects
      );
      const item = await this.orm.items.create({
        data: {
          name: ability.name,
          rarity: 1,
          type: "ability",
          iconUrl: `https://s3.akarinext.org/assets/*/pso2/op/${ability.image_type}.webp`,
          ability: { connect: ability_ids },
          droparias: { connect: aria_ids },
        },
      });
      index_body.push(createDocument(item, ability));
      logger.info(`successed register ${ability.name}.`);
    }
    try {
      let index = await client.getIndex("index_ops");
      await index.deleteDocument('index_ops');
      await index.addDocuments(index_body);
      await index.updateFilterableAttributes(['type'])
    } catch (err: any) {
      if (err.code === "index_not_found") {
        await client.createIndex('index_ops')
        let index = await client.getIndex("index_ops");
        await index.addDocuments(index_body);
        await index.updateFilterableAttributes(['type'])
      }
    }

  }
}
