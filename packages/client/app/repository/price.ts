import { prisma } from "~/utils/prisma.server";

export class PriceRepository {
  static async getPriceCount() {
    return await prisma.itemPrices.count()
  }
}