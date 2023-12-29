import { parse } from '@conform-to/zod'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { IconDots } from '@tabler/icons-react'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { Button } from '#app/components/ui/button.tsx'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu.tsx'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/ui/table.tsx'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '#app/components/ui/tabs.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { userHasPermission } from '#app/utils/permissions.ts'
import { useOptionalUser } from '#app/utils/user.ts'
import { bento } from '#app/utils/bento-cache.server.ts'

export async function loader({ params }: LoaderFunctionArgs) {
	const itemId = params.itemId

	if (!itemId) {
		throw new Error('item not found')
	}

	const prices = await bento.getOrSet(`item-price-${itemId}`, async () => {
		return await prisma.itemPrice.findMany({
			where: {
				itemId,
			},
			include: {
				reporter: { select: { name: true, username: true, image: true } },
			},
			orderBy: {
				createdAt: "desc"
			},
		})
	}, {ttl: "1m"})


	return json({ prices, itemId })
}

type ItemPriceActionArgs = {
	request: Request
	userId: string
	formData: FormData
}

export const deleteItemPriceActionIntent = 'delete-item-price'
export const deleteItemPriceFormSchema = zfd.formData({
	intent: z.literal(deleteItemPriceActionIntent),
	priceId: z.string(),
})

export async function action({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')

	switch (intent) {
		case deleteItemPriceActionIntent: {
			return deleteItemPriceAction({ userId, formData, request })
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

export async function deleteItemPriceAction({
	userId,
	formData,
}: ItemPriceActionArgs) {
	const submission = await parse(formData, {
		async: true,
		schema: deleteItemPriceFormSchema.superRefine(async ({ priceId }, ctx) => {
			const price = await prisma.itemPrice.findUnique({
				where: { id: priceId },
				select: { reporterId: true },
			})

			const isOwner = price?.reporterId === userId
			const user = await prisma.user.findUnique({
				where: { id: userId },
				include: { roles: { include: { permissions: true } } },
			})

			if (!user) {
				throw new Error('user not found')
			}

			if (price?.reporterId !== userId) {
				// 価格の報告者が自分でない場合
				const canDelete = userHasPermission(
					user,
					isOwner ? 'delete:price:own' : 'delete:price:any',
				)
				if (!canDelete) {
					// 削除権限がない場合
					ctx.addIssue({
						path: ['price'],
						code: z.ZodIssueCode.custom,
						message: 'この価格を削除する権限がありません',
					})
				}
			}
		}),
	})

	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}

	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { priceId } = submission.value

	await prisma.itemPrice.delete({ where: { id: priceId } })
	return json({ status: 'success', submission } as const)
}

function PriceDropdown({ priceId }: { priceId: string }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<IconDots />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				{/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
				{/* <DropdownMenuSeparator /> */}
				<DropdownMenuItem asChild>
					<Form method="POST">
						<input type="hidden" name="priceId" value={priceId} />
						<Button
							variant="ghost"
							size="sm"
							className="w-full text-red-400"
							type="submit"
							name="intent"
							value={deleteItemPriceActionIntent}
						>
							削除
						</Button>
					</Form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default function ItemPriceRoute() {
	const user = useOptionalUser()
	const data = useLoaderData<typeof loader>()
	return (
		<Tabs defaultValue="price">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="price">価格履歴</TabsTrigger>
				<TabsTrigger value="chart" asChild>
					<Link to={`/items/${data.itemId}/chart`}>価格の推移</Link>
				</TabsTrigger>
			</TabsList>
			<TabsContent value="price">
				<Card>
					<CardHeader>
						<CardTitle>価格履歴</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableCaption>A list of your recent invoices.</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[150px]">売値</TableHead>
									<TableHead className="w-[150px]">純売上</TableHead>
									<TableHead className="w-[100px]">ship</TableHead>
									<TableHead>報告したユーザー</TableHead>
									{user ? <TableHead>操作</TableHead> : null}
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.prices.map(price => (
									<TableRow key={price.id}>
										<TableCell className="font-medium">
											{(price.price / (1 - 0.1)).toLocaleString()}
										</TableCell>
										<TableCell>{price.price.toLocaleString()}</TableCell>
										<TableCell>{price.ship}</TableCell>
										<TableCell>{price.reporter.name}</TableCell>
										{user ? (
											<TableCell>
												<PriceDropdown priceId={price.id} />
											</TableCell>
										) : null}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
