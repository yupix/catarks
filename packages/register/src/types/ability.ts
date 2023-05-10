type TAbility = {
 name: string
 rarity: number
 image_type: string
 main_class_only: boolean
 arias: {name: string, emergency: boolean, trigger: boolean}[]
 effects: {name: string, percent: boolean, types: string[], value: number}[]

}