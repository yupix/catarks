import * as numeral from '@elastic/numeral'
import {
	type LoaderFunctionArgs,
	json,
	ActionFunctionArgs,
} from '@remix-run/server-runtime'
import { useEffect, useReducer, useState } from 'react'
import ItemTrade from '#app/assets/data/item_trade.json'
import {
	AutoComplete,
	type AutoCompleteItem,
} from '#app/components/auto-complete.tsx'
import { NIcon } from '#app/components/n-icon.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#app/components/ui/select.tsx'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/ui/table.tsx'
import { cn } from '#app/utils/misc.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { z } from 'zod'
import { prisma } from '#app/utils/db.server.ts'
import { useActionData, useSubmit } from '@remix-run/react'

export async function loader({ request }: LoaderFunctionArgs) {
	return json({})
}

const getItemPriceIntent = 'getItemPriceIntent'

const ActionVlidation = z.object({
	intent: z.literal(getItemPriceIntent),
	body: z.array(
		z.string()
	),
})

export async function action({ request }: ActionFunctionArgs) {
	const form = await request.formData()
	const requestData = ActionVlidation.parse({
		intent: form.get('intent'),
		body: form.get('body')?.toString().split(','),
	})

	const result: { [key: string]: number } = {}
	switch (requestData.intent) {
		case getItemPriceIntent:
			for (const requestItem of requestData.body) {
				const resultPrice = await prisma.itemPrice.findFirst({
					where: { item: { name: requestItem } },
					orderBy: { createdAt: 'desc' },
				})
				result[requestItem] = resultPrice?.price || 0
			}
			return json(result)
		default:
			return new Response(null, { status: 400 })
	}
}

// Stateの型定義
type State = {
	[key: string]: { price: number; number: number }
}

// Actionの型定義
type Action =
	| {
			type: 'UPDATE_PRICE'
			index: string
			price: number
			number: number
	  }
	| {
			type: 'RESET'
	  }

// reducer関数
function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'UPDATE_PRICE':
			return {
				...state,
				[action.index]: { price: action.price, number: action.number },
			}
		case 'RESET':
			return {}
		default:
			return state
	}
}

export default function CreateItemPricePage() {
	const keys = Object.keys(ItemTrade)
	const [selectedItem, setSelectedItem] = useState<AutoCompleteItem>()
	const [selectedRecipe, setSelectedRecipe] = useState<number>(0)
	const [createNumber, setCreateNumber] = useState<number>(1)
	const [shopPrice, setShopPrice] = useState<number>(0)
	const [prices, dispatch] = useReducer(reducer, {})
	const [price, setPrice] = useState<number>(0)
	const data = useActionData<typeof action>()
	const submit = useSubmit()

	const itemRecies = ItemTrade[selectedItem?.label as ItemTradeKeys]
	
	function getRecipeRequirements() {
		if (selectedItem) {
			return itemRecies[selectedRecipe]['requirements']
		}
		return []
	}

	function getRquireAmount(itemName: string) {
		
		return getRecipeRequirements().map(requirement => {
			if (requirement.name === itemName) {
				return requirement.amount
			}
		}).filter(v => v !== undefined)[0]
	}

	useEffect(() => {
		if (data) {
			for (const key of Object.keys(data)) {
				dispatch({
					type: 'UPDATE_PRICE',
					index: key,

					// @ts-ignore
					price: data[key] / 0.9,
					number: getRquireAmount(key) || 1,
				})
			}
		}
	}, [data])

	useEffect(() => {
		dispatch({ type: 'RESET' })
	}, [selectedItem])

	useEffect(() => {
		setCreateNumber(1)
	}, [selectedRecipe])

	useEffect(() => {
		setPrice(
			Object.keys(prices).map(key => {
				return prices[key]['price'] * prices[key]['number']
			}).length > 0
				? Object.keys(prices)
						.map(key => {
							return prices[key]['price'] * prices[key]['number']
						})
						.reduce((a, b) => a + b) * createNumber
				: 0,
		)
	}, [prices, createNumber])

	const getPriceHandler = (name: string | { name: string }[]) => {
		if (typeof name === "string") {
			submit(
				{ intent: getItemPriceIntent, body: name },
				{ method: 'POST' },
			)
			return
		} else {
			const names = name.map(item => item.name).join(',')
			submit({ intent: getItemPriceIntent, body: names }, { method: 'POST' })
			return
			
		}
	}

	const updatePrice = (index: string, price: number, number: number) => {
		dispatch({ type: 'UPDATE_PRICE', index, price, number: number })
	}
	const raw_shopPrice = shopPrice * createNumber
	const sales = raw_shopPrice - raw_shopPrice * 0.1 - price

	return (
		<>
			<div className="flex justify-between rounded-md border p-4">
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="createItem">作成するアイテム</Label>
					<AutoComplete
						id={'createItem'}
						label="アイテムを選択"
						onCustomSelected={option => setSelectedItem(option)}
						options={keys.map(key => {
							return { label: key, value: key }
						})}
						placeholder="アイテムを選択"
					/>
				</div>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="shopPrice">ショップでの価格</Label>
					<Input
						min={0}
						step={100}
						type="number"
						max={9999999999}
						id="shopPrice"
						value={shopPrice}
						onChange={v => setShopPrice(Number(v.target.value))}
					/>
				</div>
			</div>

			{selectedItem && (
				<div className="rounded-md border p-4">
					<div className="flex justify-between">
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="selectRecipe">作成個数</Label>
							<Select
								name="selectRecipe"
								defaultValue={String(0)}
								onValueChange={v => setSelectedRecipe(Number(v))}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="使用するレシピ" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{ItemTrade[selectedItem?.label as ItemTradeKeys].map(
											(recipe, i) => (
												<SelectItem key={i} value={String(i)}>
													レシピ {i + 1}
												</SelectItem>
											),
										)}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className="form-control w-full max-w-xs"></div>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="createNumber">作成個数</Label>
							<Input
								//   label="作成する数"
								min={0}
								type="number"
								max={999}
								id="createNumber"
								value={createNumber}
								onChange={v => setCreateNumber(Number(v.target.value))}
							/>
						</div>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[200px]">アイテム名</TableHead>
								<TableHead>必要数</TableHead>
								<TableHead>1つあたりの値段</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{ItemTrade[selectedItem?.label as ItemTradeKeys][selectedRecipe][
								'requirements'
							].map((recipe, i) => (
								<TableRow key={`${recipe.name}${selectedRecipe}${i}`}>
									<TableCell className="font-medium">{recipe.name}</TableCell>
									<TableCell>{recipe.amount}</TableCell>
									<TableCell>
										<div className="flex justify-items-center">
											<Input
												type="number"
												min={0}
												step={100}
												//   label="値段"
												value={prices[recipe.name]?.price || 0}
												onChange={target =>
													updatePrice(
														recipe.name,
														Number(target.target.value),
														Number(recipe.amount),
													)
												}
											/>
											<Button onClick={() => getPriceHandler(recipe.name)}>
												価格を取得
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
			<Spacer size={'4xs'} />

			<div className="grid grid-cols-2 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">必要な総額</CardTitle>
						<NIcon />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{price.toLocaleString()}
							{price > 1000 ? (
								<> ({numeral.default(price).format('0.0a')})</>
							) : null}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">純売上</CardTitle>
						<NIcon />
					</CardHeader>
					<CardContent>
						<div
							className={cn(
								'text-2xl font-bold',
								0 === sales
									? ''
									: sales > 0
									  ? 'text-green-300'
									  : 'text-red-300',
							)}
						>
							{sales === 0
								? sales
								: sales > 0
								  ? `+${sales.toLocaleString()}`
								  : sales.toLocaleString()}
							{sales > 1000 ? (
								<> ({numeral.default(sales).format('0.0a')})</>
							) : null}
						</div>
						<p className="text-xs text-muted-foreground">
							システム利用料（10%）は排除しています。
						</p>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
