
interface AbilityEffectDto {name: string, percent: boolean, effect: string}

interface AbilityDto {name: string, effects: AbilityEffectDto[]}

interface ItemDto {type: 'ability' | 'weapon', ability: AbilityDto, id: string, name: string, rarity: number, iconUrl: string, prices: string, droparias: string}

interface getItemsDto {max: number, items: ItemDto[]}

interface UserDto {id: string, username: string, avatarUrl: string, description: string, discordId?: string, ship: number, bannerUrl?: string}

interface getItemPriceDto {reporter: UserDto}

interface createItemPriceDto {price: number, ship: number}

interface CreatedItemPriceDto {price: number}

type CreateUserDto = any


interface ALREADY_USED_USERNAME_ERROR {id: '58ee27a1-f431-4e6f-9656-666ed857d9bc', type: 'failed', code: 'ALREADY_USED_USERNAME', message: '既に利用されているユーザー名です'}

interface UserSettingsDto {useDarkTheme: boolean}

interface MeDto {id: string, username: string, avatarUrl: string, description: string, discordId?: string, ship: number, bannerUrl?: string, settings: UserSettingsDto}

type IntegrationRequestDto = any


interface ALREADY_CONNECTED_TO_DISCORD_ERROR {id: '639ebe9f-b8be-435c-a350-5802e1ad2687', type: string, code: 'ALREADY_CONNECTED_TO_DISCORD', message: '既にDiscordと連携済みです'}

interface PatchProfileDto {ship?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, bannerUrl?: string, avatarUrl?: string, description?: string}
type Schema = {resource: {
"/api": {
    GET: {
        response: any
    }
}

"/api/items": {
    GET: {
        query: {
            type: 'ability' | 'weapon' | 'armor',
            skip?: number,
            limit: number
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

"/api/items/prices": {
    GET: {
        query: {
            type: 'ability' | 'weapon' | 'armor'
        },
        response: any
    }
}

"/api/items/:itemId/price": {
    GET: {
        query: {
            limit: number,
            sort: 'desc' | 'asc'
        },
        params: {
            itemId: string
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

"/api/users/:username/:username": {
    GET: {
        params: {
            username: string
        },
        response: UserDto
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

"/api/user/avatar": {
    POST: {
        response: any
    }
}

"/api/user": {
    PATCH: {
        body: PatchProfileDto,
        response: UserDto
    }
}

"/api/queues/:jobId": {
    GET: {
        params: {
            jobId: string
        },
        response: any
    }
}
}}