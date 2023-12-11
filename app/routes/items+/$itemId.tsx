import {
	Link,
	MetaFunction,
	Outlet,
	useLoaderData,
	useSubmit,
} from '@remix-run/react'
import {
	ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/server-runtime'
import { Container } from '#app/components/container.tsx'
import { ItemCard } from '#app/components/item.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { createToastHeaders } from '#app/utils/toast.server.ts'
import { z } from 'zod'

export async function loader({ params }: LoaderFunctionArgs) {
	const item = await prisma.item.findUnique({
		where: { id: params.itemId },
		include: {
			ability: { include: { effects: true } },
			droparias: true,
			prices: {
				include: {
					reporter: { select: { name: true, username: true, image: true } },
				},
			},
		},
	})

	if (!item) {
		throw new Error('item not found')
	}

	return item
}

const ItemCopyCompleteIntent = 'completeItemCopy'
const ItemActionValidation = z.object({
	intent: z.literal(ItemCopyCompleteIntent),
})

export async function action({ request }: ActionFunctionArgs) {
	const form = await request.formData()
	const requestData = ItemActionValidation.parse({ intent: form.get('intent') })
	switch (requestData.intent) {
		case ItemCopyCompleteIntent: {
			return new Response('OK', {
				headers: await createToastHeaders({
					description: 'アイテム名をコピーしました',
				}),
				status: 200,
			})
		}
		default: {
			throw new Response(`Invalid intent "${requestData.intent}"`, {
				status: 400,
			})
		}
	}
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (data === null || data === undefined) {
		return [{ title: 'Error | CatArks' }]
	}
	return [
		{ title: `${data.name} | CatArks` },
		{ name: 'og:url', content: `https://catarks.com/items/${data.id}/price` },
		{
			name: 'twitter:url',
			content: `https://catarks.com/items/${data.id}/price`,
		},
		{ name: 'og:title', content: `${data.name} | CatArks` },
		{ name: 'twitter:title', content: `${data.name} | CatArks` },
	]
}

export default function ItemRoute() {
	const data = useLoaderData<typeof loader>()
	const submit = useSubmit()
	return (
		<Container>
			<Spacer size="xs" />
			<section>
				<ItemCard
					item={data}
					useCopy
					copyHandler={item =>
						submit(
							{ intent: ItemCopyCompleteIntent },
							{ method: 'POST', navigate: false },
						)
					}
				/>
			</section>

			<Spacer size="4xs" />

			<section className="grid grid-cols-1 gap-4  sm:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>入手方法</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{data.droparias.length === 0
								? '入手方法は準備中です'
								: data.droparias.map(aria => (
										<Link to={`/items/aria/${aria.name}`} key={aria.name}>
											<li>{aria.name}</li>
										</Link>
								  ))}
						</ul>
					</CardContent>
					<CardFooter className="text-xs text-gray-700 dark:text-gray-400">
						クリックすると、その場所で入手できるアイテムの一覧が閲覧できます
					</CardFooter>
				</Card>

				{data.type === 'ability' && (
					<Card>
						<CardHeader>
							<CardTitle>特殊能力の効果</CardTitle>
						</CardHeader>
						<CardContent>
							<ul>
								{data.ability?.effects.length === 0
									? '効果がありません、これが表示される場合は管理者に報告してください'
									: data.ability?.effects.map(effect => (
											<li key={effect.name}>{effect.name}</li>
									  ))}
							</ul>
						</CardContent>
					</Card>
				)}
			</section>

			<Spacer size="4xs" />

			<section>
				<Outlet />
			</section>
		</Container>
	)
}
