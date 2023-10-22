import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs, json } from "@remix-run/server-runtime";
import { Container } from "#app/components/container.tsx";
import { ItemCard } from "#app/components/item.tsx";
import { prisma } from "#app/utils/db.server.ts";

export async function loader({ params }: LoaderFunctionArgs) {
    const reports = await prisma.itemPrice.findMany({
        select: {
            id: true,
            createdAt: true,
            item: { include: {ability: true} },
            itemId: true,
            price: true,
            ship: true
        },
        where: {
            reporter: {
                username: params.username
            }
        }
    })
    return json(reports)
}

export default function Reports() {
    const data = useLoaderData<typeof loader>()
    return (
        <Container>
            <h1>過去に価格を報告したアイテム</h1>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2">
                {data.map((report) => {
                    return (
                        <ItemCard item={report.item} nowPrice={report.price} key={report.id}/>
                        // <div>
                        //     <h2>{report.item.name}</h2>
                        //     <h3>{report.price}</h3>
                        //     <h3>{report.ship}</h3>
                        // </div>
                    )
                })}
            </div>
        </Container>
    )
}