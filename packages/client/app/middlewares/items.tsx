import { prisma } from "~/utils/prisma.server";
import { TItemQuery } from "~/validations/items/index.query";

export const getItems = async ({ limit, skip, type }: TItemQuery) => {
  const maxCount = await prisma.items.count();
  const items = await prisma.items.findMany({
    where: {
      type,
    },
    skip,
    take: limit,
    include: {
      ability: {
        include: {
          effects: true
        }
      },
      droparias: true
    }
  })
  return {items, max: maxCount}
}

export const getItemByID = async (itemId: string) => {
  return await prisma.items.findFirst({where: {
    id: itemId
  }, include: {prices: {include: {reporter: true}}, droparias: true, ability: {include: {effects: true}}}})
}