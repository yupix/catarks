import { Container } from '#app/components/container.tsx'
import { ItemCard } from '#app/components/item.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import { TopSection } from '#app/components/top-section.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { Link, useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime'

export async function loader({ params }: LoaderFunctionArgs) {
	const ariaName = params.ariaName
	if (!ariaName) {
		throw new Error('aria not found')
	}

	const ariaItems = await prisma.itemDroparia.findFirst({
		where: {
			name: ariaName,
		},
		include: { Items: true },
	})

	if (!ariaItems) {
		throw new Error('aria not found')
	}

	return json(ariaItems)
}

export default function AriaRoute() {
	const data = useLoaderData<typeof loader>()
	return (
		<Container>
			<Spacer size={'xs'} />
			<TopSection className="h-60">
				<div className="text-3xl font-bold text-white">
					{data.name} で入手可能なアイテム
				</div>
			</TopSection>
			<Spacer size={'4xs'} />

			<div className="grid grid-cols-3 gap-4">
				{data.Items.map(item => (
					<Link to={`/items/${item.id}/price`} key={item.id}>
						<ItemCard item={item} key={item.id} />
					</Link>
				))}
			</div>
		</Container>
	)
}
