import { prisma } from "#app/utils/db.server.ts";
import { LoaderFunctionArgs, json } from "@remix-run/server-runtime";
import { z } from "zod";
import { ITEM_TYPES } from "#app/utils/const.ts";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { ItemCard } from "#app/components/item.tsx";
import { Container } from "#app/components/container.tsx";
import { replaceFuzzyWord } from "#app/utils/text-convertor.ts";
import { Pagination } from "#app/components/pagination.tsx";
import { Input } from "#app/components/ui/input.tsx";

const CategoryValidation = z.enum(ITEM_TYPES)
const limit = 24;

export async function loader({ params, request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const raw_p = url.searchParams.get("p");  // page
    const p = raw_p ? parseInt(raw_p) : 1;

    const q = url.searchParams.get("q");  // query


    const type = CategoryValidation.parse(params.category)
    const items = await prisma.item.findMany({
        where: {
            type,
            fuzzyName: q ? {
                contains: replaceFuzzyWord(q),
            } : undefined
        },
        orderBy: {
            name: 'asc'
        },
        skip: (p-1) * limit,
        take: limit
    })

    const total = await prisma.item.count({
        where: {
            type,
            fuzzyName: q ? {
                contains: replaceFuzzyWord(q),
            } : undefined
        },
    })

    return json({ items, total, p: p })
}

export default function Category() {
    const { items, total, p } = useLoaderData<typeof loader>()
    const [query, setSearchQuery] = useSearchParams();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery({ ...query, q: e.target.value })
    }

    return (
        <Container>
            {/* <h1>カテゴリー</h1> */}
            <Input className="my-3" placeholder="カテゴリ内検索" onChange={(e) => handleSearch(e)}></Input>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mb-4">
                {
                    items.map((item) => {
                        return (
                            <Link to={`/items/${item.id}/price`} key={item.id} unstable_viewTransition >
                                <ItemCard item={item} />
                            </Link>
                        )
                    })
                }
                {items.length === 0 && <div className="font-bold text-2xl">Coming Soon...</div>}
            </div>
            {p}
            <Pagination totalPages={Math.floor(total / limit)} currentPage={p} pageRangeDisplayed={3} onChange={function (pageNumber: number): void {
                setSearchQuery({ ...query, p: String(pageNumber) })
            }} />
        </Container>
    )
}