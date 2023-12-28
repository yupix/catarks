import {type Prisma} from '@prisma/client'
import {useThrottleFn} from '@reactuses/core'
import {type LoaderFunctionArgs} from '@remix-run/node'
import {Link, useSearchParams} from '@remix-run/react'
import {typedjson, useTypedLoaderData} from 'remix-typedjson'
import {z} from 'zod'
import {AutoComplete} from '#app/components/auto-complete.tsx'
import {Container} from '#app/components/container.tsx'
import {ItemCard} from '#app/components/item.tsx'
import {Spacer} from '#app/components/spacer.tsx'
import {Button} from '#app/components/ui/button.tsx'
import {ITEM_TYPES, ItemRarities, ShipTypes, TYPE_TO_CATEGORY} from '#app/utils/const.ts'
import {prisma} from '#app/utils/db.server.ts'

const ItemRankingQueryValidation = z.object({
    type: z.optional(z.enum(ITEM_TYPES)),
    ship: z.optional(z.string().transform(e => Number(e))),
    sort: z.optional(z.enum(['asc', 'desc'])).default('desc'),
    rarity: z.optional(z.string().transform(e => Number(e))),
})

export async function loader({request}: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const query = ItemRankingQueryValidation.parse({
        ship: url.searchParams.get('ship') ?? undefined,
        type: url.searchParams.get('type') ?? undefined,
        sort: url.searchParams.get('sort') ?? undefined,
        rarity: url.searchParams.get('rarity') ?? undefined,
    })
    const where: Prisma.ItemPriceWhereInput = {
        ship: 8,
    }
    try {
        if (query.ship) where['ship'] = query.ship

        if (query.type || query.rarity) {
            where['item'] = {}
            where['item']['type'] = query.type
            where['item']['rarity'] = query.rarity
        }

        const sinceDate = new Date()
        sinceDate.setDate(sinceDate.getDate() - 30)
        const untilDate = new Date()
        const items = await prisma.itemPrice.findMany({
            distinct: 'itemId',
            where: {
                ...where,
                createdAt: {
                    gte: sinceDate,
                    lt: untilDate
                }
            },
            orderBy: {createdAt: 'desc'},
            include: {item: true},
        })
        const sortableItems = items.sort((a, b) => a.price - b.price)
        if (query.sort === 'asc') {
            sortableItems.map(v => {
                return {...v.item, price: v.price}
            })
        } else {
            sortableItems.reverse().map(v => {
                return {...v.item, price: v.price}
            })
        }

        return typedjson({items: sortableItems, query})
    } catch (err) {
        throw Error('Invalidate Query')
    }
}

export default function ItemRankingLayout() {
    const {items, query: loaderQuery} = useTypedLoaderData<typeof loader>()
    const [rawQuery, setSearchQuery] = useSearchParams()
    const query = {...Object.fromEntries(rawQuery.entries())}

    const setQuery = (key: string, value: string) => {
        setSearchQuery({
            ...query,
            [key]: value,
        })
    }


    const {run: handleQueryReset} = useThrottleFn(() => {
        setSearchQuery({})
    }, 700)

    return (
        <Container>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="col-span-2 w-full rounded-md border md:col-span-1">
                    <h1 className="py-4 text-center text-2xl font-bold">オプション</h1>
                    <div className="border-b"/>
                    <div className="px-4 py-2">
                        <AutoComplete
                            options={[
                                {label: '昇順', value: 'asc'},
                                {label: '降順', value: 'desc'},
                            ]}
                            defaultSelected={{label: '降順', value: 'desc'}}
                            placeholder={'並び替え'}
                            label="並び替え"
                            onSelected={option => setQuery('sort', option.value)}
                        />
                        <Spacer size="4xs"/>

                        <AutoComplete
                            options={ITEM_TYPES.map(type => {
                                return {label: TYPE_TO_CATEGORY[type], value: type}
                            })}
                            placeholder={'カテゴリを選択'}
                            label="カテゴリ"
                            onSelected={option => setQuery('type', option.value)}
                        />
                        <Spacer size="4xs"/>

                        <AutoComplete
                            options={ItemRarities.map(rarity => {
                                return {
                                    label: `★${rarity}`,
                                    value: rarity.toString(),
                                }
                            })}
                            placeholder={'レアリティを選択'}
                            label="レアリティ"
                            onSelected={option => setQuery('rarity', option.value)}
                        />

                        <Spacer size="4xs"/>

                        <AutoComplete
                            options={ShipTypes.map(ship => {
                                return {
                                    label: `${ship}`,
                                    value: ship.toString(),
                                }
                            })}
                            defaultSelected={{
                                label: loaderQuery.ship?.toString() || "8",
                                value: loaderQuery.ship?.toString() || "8"
                            }}
                            placeholder={'シップを選択'}
                            label="シップ"
                            onSelected={option => setQuery('ship', option.value)}
                        />

                        <Button className="mt-4 w-full" onClick={handleQueryReset}>
                            検索条件をリセット
                        </Button>
                    </div>
                </div>
                <div className="col-span-4 md:col-span-5">
                    <div className="mb-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((item, i) => {
                            return (
                                <Link key={item.id} to={`/items/${item.itemId}/price`}>
                                    <div>
                                        #{i + 1}
                                        <ItemCard item={item.item} nowPrice={item.price}/>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Container>
    )
}
