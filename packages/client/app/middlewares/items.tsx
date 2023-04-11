import type { Prisma, Users } from "@catarks/db";
import type { PickType } from "@catarks/utils";
import { prisma } from "~/utils/prisma.server";
import type { TItemQuery } from "~/validations/items/index.query";

export async function GetItemPriceById(priceId: string) {
  return await prisma.itemPrices.findFirst({
    where: {
      id: priceId,
    },
    include: { reporter: true },
  });
}

export async function getRecentItemPriceList(limit: number) {
  return await prisma.itemPrices.findMany({take: limit, include: {reporter: true, item: true}, orderBy: {createdAt: 'desc'}})
}

export async function DeleteItemPriceById(priceId: string, actionUser: Users) {
  const getItemPriceResult = await GetItemPriceById(priceId);
  if (getItemPriceResult?.reporter.id === actionUser.id) {
    return await prisma.itemPrices.delete({
      where: {
        id: priceId,
      },
    });
  }
}

export async function getItems({
  limit,
  skip,
  type,
  select = {
    iconUrl: true,
    name: true,
    id: true,
    rarity: true,
    type: true,
    droparias: true,
    ItemPriceAverage: {
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ship: 0,
      },
      take: 1,
    },
    ability: { include: { effects: true } },
  },
}: TItemQuery & { select?: PickType<Prisma.ItemsFindManyArgs, "select"> }) {
  const maxCount = await prisma.items.count();
  const items = await prisma.items.findMany({
    select,
    where: {
      type,
    },
    skip,
    take: limit,
    orderBy: {
      name: "asc",
    },
  });

  return { items, max: maxCount };
}

export async function getItemByID(itemId: string) {
  return await prisma.items.findFirst({
    where: {
      id: itemId,
    },
    include: {
      prices: { include: { reporter: { include: { role: true } } } },
      droparias: true,
      ability: { include: { effects: true } },
    },
  });
}
