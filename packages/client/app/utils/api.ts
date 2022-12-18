
export interface AbilityEffectDto {name: string, percent: boolean, effect: string}

export interface AbilityDto {name: string, effects: AbilityEffectDto[]}

export interface ItemPriceDto {id: string}

export interface ItemDto {type: 'ability' |'weapon' , ability: AbilityDto, id: string, name: string, rarity: number, iconUrl: string, prices: ItemPriceDto[]}

export interface getItemsDto {max: number, items: ItemDto[]}

export interface createItemPriceDto {itemId: string, price: number}

export interface CreatedItemPriceDto {price: number}

export type CreateUserDto = any

export type Schema = {resource: {
"/api": {
    GET: {
        response: any
    }
}

"/api/items": {
    GET: {
        query: {
            type?: string,
            skip?: number,
            limit?: number
        },
        response: getItemsDto
    }
}

"/api/items/:itemId": {
    GET: {
        params: {
            itemId: string
        },
        response: ItemDto
    }
}

"/api/items/:itemId/price": {
    GET: {
        params: {
            itemId: string
        },
        response: any
    },
    POST: {
        params: {
            itemId: string
        },
        body: createItemPriceDto,
        response: CreatedItemPriceDto
    }
}

"/api/auth/signup": {
    POST: {
        body: CreateUserDto,
        response: any
    }
}

"/api/auth/signin": {
    POST: {
        body: CreateUserDto,
        response: any
    }
}

"/api/auth/signout": {
    POST: {
        response: any
    }
}

"/api/users/whoami": {
    GET: {
        response: any
    }
}

"/api/users/:userId": {
    GET: {
        params: {
            userId: string
        },
        response: any
    }
}
}}