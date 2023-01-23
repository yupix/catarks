import cron from "node-cron";
import { PrismaClient } from "@catarks/db";



const prisma = new PrismaClient();

cron.schedule('0 0 6 * * *', async function(){
  const currentDate = new Date()
  const ToDayStart = currentDate.setHours(0,0,0,0);
  const ToDayEnd = currentDate.setHours(23,59,59,59)

  const items = await prisma.items.findMany();
  for (const item of items) {
  for (const ship of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      const prices = await prisma.itemPrices.findMany({
        where: { itemId: item.id, ship: ship === 0 ? undefined : ship, createdAt: {
          gte: new Date(ToDayStart),
          lt: new Date(ToDayEnd),
        } },
      });
      if (prices.length > 0) {
        const _prices = prices.map((price) => price.price)
        const average = _prices.reduce((a, b) => a + b) / _prices.length
        await prisma.itemPriceAverage.create({data: {
          price: Math.floor(average),
          ship: ship,
          createdAt: new Date(ToDayStart),
          itemsId: item.id
        }})
      }
    }
  }
  // console.log('hh:mm:30に実行します'+date);
});
