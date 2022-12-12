import { Abilities, AbilityEffects, PrismaClient } from "@vent/db";
import { Logger } from "@vent/shared";
import ops from "../assets/ops.json";
import { ORM } from "../db/session";
import { BaseRegister } from "../types/register";

interface IEffect {
    name: string
    percent: boolean
    effect: string | number
}

export class RegisterOP implements BaseRegister {
    orm!: PrismaClient
    constructor() {
        this.orm = ORM.instance()
    }

    async registerEffect(effects: IEffect[]) {
        let effect_ids = []
        for (const effect of effects) {
            const hitEffect = await this.orm.abilityEffects.findFirst({where: {name: effect.name}})
            
            let opEffect: AbilityEffects
            if (hitEffect) {
                opEffect = hitEffect
            } else {
                opEffect = await this.orm.abilityEffects.create({
                    data: {
                        name: effect.name,
                        effect: String(effect.effect),
                        percent: effect.percent
                    }
                })
            }
            effect_ids.push({name: opEffect.name})
        }
        return effect_ids
    }

    async registerOP(name: string, effects: IEffect[]) {
        let op: Abilities
        const hitOP = await this.orm.abilities.findFirst({where: {
            name
        }})
        if (hitOP) {
            op = hitOP
        } else {
            const effect_ids = await this.registerEffect(effects)
            op = await this.orm.abilities.create({data: {
                name,
                effects: {
                    connect: effect_ids
                }
            }});
            op.name = name
        }
        return {name: op.name}
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
        for (const op of ops) {
            const logger = Logger.getInstance
            const getItem = await this.orm.items.findFirst({where:{ name: op.name }});
            if (getItem) {
                logger.info(`${op.name} is already exists. skip`)
                continue
            }
            // await this.registerDropAria(newItem, op.aries)
            const ability_ids = await this.registerOP(op.name, op.effect)
            const newItem = await this.orm.items.create({data: {
                name: op.name,
                rarity: 1,
                type: 'op',
                ability: {connect: ability_ids}
            }})
            logger.info(`successed register ${op.name}.`)
        }
    }

}
