import { prisma } from "~/utils/prisma.server";
import { TItemQuery } from "~/validations/items/index.query";

export async function getItems({limit, skip, type}: TItemQuery) {
    return await prisma.items.findMany({
        where: {type},
        take: limit,
        skip,
    })
}