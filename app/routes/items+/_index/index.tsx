import { Container } from "#app/components/container.tsx";
import { ItemCard } from "#app/components/item.tsx";
import { prisma } from "#app/utils/db.server.ts";
import { replaceFuzzyWord } from "#app/utils/text-convertor.ts";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/server-runtime";

export async function loader({request}: LoaderFunctionArgs) {
    const searchTerm = new URL(request.url).searchParams.get('search')
	if (searchTerm === '') {
		return redirect('/items')  // 検索語が無いなら、クエリ消してリダイレクトする
	}

	const items = await prisma.item.findMany({where: {
		
		fuzzyName: {
			contains: replaceFuzzyWord(searchTerm || '')
		}
	}})
	return json(items);
}

export type ItemsRouteLoader =  typeof loader

export default function ItemsRoute() {
	const data = useLoaderData<typeof loader>()
    return (
		<Container>
			<div className="grid grid-cols-3 gap-4">
				{data.map((item) => (
					<ItemCard item={item}/>
				))}
			</div>
		</Container>
	)
}