
interface AbilityEffectDto {name: string, percent: boolean, effect: string}

interface AbilityDto {name: string, effects: AbilityEffectDto[]}

interface ItemPriceDto {id: string}

interface ItemDto {type: 'ability' |'weapon' , ability: AbilityDto, id: string, name: string, rarity: number, iconUrl: string, prices: ItemPriceDto[]}

interface getItemsDto {max: number, items: ItemDto[]}

interface createItemPriceDto {itemId: string, price: number}

interface CreatedItemPriceDto {price: number}

type CreateUserDto = any


interface UserDto {id: string, username: string, avatarUrl: string, useDarkTheme: boolean}
type Schema = {resource: {
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
        response: UserDto
    }
}

"/api/auth/signin": {
    POST: {
        body: CreateUserDto,
        response: UserDto
    }
}

"/api/auth/signout": {
    POST: {
        response: any
    }
}

"/api/users/whoami": {
    GET: {
        response: object
    }
}

"/api/users/:userId": {
    GET: {
        params: {
            userId: string
        },
        response: object
    }
}
}}