import { prisma } from "#app/utils/db.server.ts";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
    return json(await prisma.item.findFirst({ where: { id: params.itemId }, select: {iconUrl: true} }))
}
