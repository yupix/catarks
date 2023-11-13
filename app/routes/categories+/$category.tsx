import { useThrottleFn } from '@reactuses/core'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { type LoaderFunctionArgs, json } from '@remix-run/server-runtime'
import { z } from 'zod'
import { AutoComplete } from '#app/components/auto-complete.tsx'
import { Container } from '#app/components/container.tsx'
import { ItemCard } from '#app/components/item.tsx'
import { Pagination } from '#app/components/pagination.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { ITEM_TYPES, ItemRarities } from '#app/utils/const.ts'
import { prisma } from '#app/utils/db.server.ts'
import { useDebounce } from '#app/utils/misc.tsx'
import { replaceFuzzyWord } from '#app/utils/text-convertor.ts'

const CategoryValidation = z.enum(ITEM_TYPES)
const limit = 24

export async function loader({ params, request }: LoaderFunctionArgs) {
	const url = new URL(request.url)
	const raw_p = url.searchParams.get('p') // page
	const p = raw_p ? parseInt(raw_p) : 1
	const q = url.searchParams.get('q') // query
	const rarity = url.searchParams.get('rarity') // レアリティ

	const type = CategoryValidation.parse(params.category)
	const items = await prisma.item.findMany({
		where: {
			type,
			fuzzyName: q
				? {
						contains: replaceFuzzyWord(q),
				  }
				: undefined,
			rarity: rarity ? parseInt(rarity) : undefined,
		},
		orderBy: {
			name: 'asc',
		},
		skip: (p - 1) * limit,
		take: limit,
	})

	const total = await prisma.item.count({
		where: {
			type,
			fuzzyName: q
				? {
						contains: replaceFuzzyWord(q),
				  }
				: undefined,
			rarity: rarity ? parseInt(rarity) : undefined,
		},
	})
	return json({ items, total, p, q })
}

export default function Category() {
	const { items, total, p, q } = useLoaderData<typeof loader>()
	const [rawQuery, setSearchQuery] = useSearchParams()
	const query = { ...Object.fromEntries(rawQuery.entries()) }
	const totalPage = Math.ceil(total / limit)

	const setQuery = (key: string, value: string) => {
		setSearchQuery({
			...query,
			[key]: value,
		})
	}

	const handleQueryChange = useDebounce(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setQuery('q', e.target.value)
		},
		200,
	)

	const { run: handleQueryReset } = useThrottleFn(() => {
		setSearchQuery({})
	}, 700)

	return (
		<Container>
			<Input
				defaultValue={q ?? ''}
				className="my-3"
				placeholder="カテゴリ内検索"
				onChange={e => handleQueryChange(e)}
			></Input>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
				<div className="col-span-2 w-full rounded-md border md:col-span-1">
					<h1 className="py-4 text-center text-2xl font-bold">オプション</h1>
					<div className="border-b" />
					<div className="px-4 py-2">
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
						<Button className="mt-4 w-full" onClick={handleQueryReset}>
							検索条件をリセット
						</Button>
					</div>
				</div>
				<div className="col-span-4 md:col-span-5">
					<div className="mb-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						{items.map(item => {
							return (
								<Link
									to={`/items/${item.id}/price`}
									key={item.id}
									unstable_viewTransition
								>
									<ItemCard item={item} />
								</Link>
							)
						})}
						{items.length === 0 && (
							<div className="text-2xl font-bold">
								アイテムが見つかりませんでした
							</div>
						)}
					</div>
					{totalPage ? (
						<Pagination
							totalPages={totalPage}
							currentPage={p}
							pageRangeDisplayed={3}
							onChange={function (pageNumber: number): void {
								setSearchQuery({ ...query, p: String(pageNumber) })
							}}
						/>
					) : null}
				</div>
			</div>
		</Container>
	)
}
