import { prisma } from "#app/utils/db.server.ts";


async function main() {
  const currentDate = new Date();
  const ToDayStart = new Date(currentDate.setHours(0, 0, 0, 0)).setDate(
    currentDate.getDate()
  );
  const ToDayEnd = new Date(currentDate.setHours(23, 59, 59, 59)).setDate(
    currentDate.getDate()
  );
  const items = await prisma.item.findMany();
  for (const item of items) {
    for (const ship of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      const prices = await prisma.itemPrice.findMany({
        where: {
          itemId: item.id,
          ship: ship === 0 ? undefined : ship,
          createdAt: {
            gte: new Date(ToDayStart),
            lt: new Date(ToDayEnd),
          },
        },
      });
      if (prices.length > 0) {
        const _prices = prices.map((price) => price.price);
        const average = _prices.reduce((a, b) => a + b) / _prices.length;
        await prisma.itemPriceAverage.create({
          data: {
            price: Math.floor(average),
            ship: ship,
            createdAt: new Date(ToDayStart),
            itemId: item.id,
          },
        });
      }
    }
  }
}
main();
