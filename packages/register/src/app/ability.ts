import { Abilities, AbilityEffects, PrismaClient } from "@vent/db";
import { Logger } from "@vent/shared";
import abilities from "../assets/ops.json";
import { ORM } from "../db/session";
import { BaseRegister } from "../types/register";

interface IEffect {
    name: string
    percent: boolean
    effect: string | number
}

export class RegisterAbility implements BaseRegister {
    orm!: PrismaClient
    constructor() {
        this.orm = ORM.instance()
    }

    async registerEffect(effects: IEffect[]) {
        let effect_ids = []
        for (const effect of effects) {
            const existsEffect = await this.orm.abilityEffects.findFirst({where: {name: effect.name}})
            
            let abilityEffect: AbilityEffects
            if (existsEffect) {
                abilityEffect = existsEffect
            } else {
                abilityEffect = await this.orm.abilityEffects.create({
                    data: {
                        name: effect.name,
                        effect: String(effect.effect),
                        percent: effect.percent
                    }
                })
            }
            effect_ids.push({name: abilityEffect.name})
        }
        return effect_ids
    }

    async registerAbility(name: string, effects: IEffect[]) {
        let ability: Abilities
        const existsAbility = await this.orm.abilities.findFirst({where: {
            name
        }})
        if (existsAbility) {
            ability = existsAbility
        } else {
            const effect_ids = await this.registerEffect(effects)
            ability = await this.orm.abilities.create({data: {
                name,
                effects: {
                    connect: effect_ids
                }
            }});
            ability.name = name
        }
        return {name: ability.name}
    }

    // async registerDropAria(aries: string[]) {
    //     for (const aria of aries) {
    //         let addAria: DropAries
    //         const hitAria = await this.dropariaRepository.findOne({
    //             name: aria
    //         })
    //         if (hitAria) {
    //             addAria = hitAria
    //         } else {
    //             addAria = new DropAries();
    //             addAria.name = aria
    //         }
    //         item.droparies.add(addAria)
    //     }
    //     return item
    // }

    async run() {
        for (const ability of abilities) {
            const logger = Logger.getInstance
            const existsItem = await this.orm.items.findFirst({where:{ name: ability.name }});
            if (existsItem) {
                logger.info(`${ability.name} is already exists. skip`)
                continue
            }
            // await this.registerDropAria(newItem, op.aries)
            const ability_ids = await this.registerAbility(ability.name, ability.effect)
            await this.orm.items.create({data: {
                name: ability.name,
                rarity: 1,
                type: 'ability',
                ability: {connect: ability_ids}
            }})
            logger.info(`successed register ${ability.name}.`)
        }
    }

}
