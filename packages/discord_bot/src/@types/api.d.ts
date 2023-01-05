
interface AbilityEffectDto {name: string, percent: boolean, effect: string}

interface AbilityDto {name: string, effects: AbilityEffectDto[]}

interface UserDto {id: string, username: string, avatarUrl: string, discordId: string, ship: number, bannerUrl: string, createdAt: string}

interface ItemPriceDto {id: string, price: number, ship: number, reporter: UserDto, reporterId: string}

interface DropAriaDto {name: string}

interface ItemDto {type: 'ability' |'weapon' , ability: AbilityDto, id: string, name: string, rarity: number, iconUrl: string, prices: ItemPriceDto[], droparias: DropAriaDto[]}

interface getItemsDto {max: number, items: ItemDto[]}

interface getItemPriceDto {reporter: UserDto, id: string, price: number, reporterId: string, createdAt: string}

interface createItemPriceDto {price: number, ship: number}

interface CreatedItemPriceDto {price: number}

interface CreateUserDto {username: string, password: string}

interface UserSettingsDto {useDarkTheme: boolean}

interface MeDto {id: string, username: string, avatarUrl: string, discordId: string, ship: number, bannerUrl: string, settings: UserSettingsDto, createdAt: string}

interface IntegrationRequestDto {code: string}

interface ErrorDto {id: string, type: string, code: string, message: string}
type Schema = {resource: {
"/api": {
    GET: {
        response: string
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
        query: {
            limit?: number
        },
        response: getItemPriceDto[]
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
        response: MeDto
    }
}

"/api/auth/signout": {
    POST: {
        response: any
    }
}

"/api/users/whoami": {
    GET: {
        response: MeDto
    }
}

"/api/users/:userId": {
    GET: {
        params: {
            userId: string
        },
        response: UserDto
    }
}

"/api/users/integration/discord": {
    POST: {
        response: IntegrationRequestDto
    }
}
}}