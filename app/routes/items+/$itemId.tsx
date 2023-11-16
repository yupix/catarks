import { Outlet, useLoaderData } from '@remix-run/react'
import { type LoaderFunctionArgs } from '@remix-run/server-runtime'
import { Container } from '#app/components/container.tsx'
import { ItemCard } from '#app/components/item.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import { prisma } from '#app/utils/db.server.ts'

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

export default function ItemRoute() {
	const data = useLoaderData<typeof loader>()
	return (
		<Container>
			<Spacer size="xs" />
			<section>
				<ItemCard item={data} />
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
										<li key={aria.name}>{aria.name}</li>
								  ))}
						</ul>
					</CardContent>
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
