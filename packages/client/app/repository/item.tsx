import { prisma } from "~/utils/prisma.server";

export class ItemRepository {
  static async findManyByAriaName(name: string) {
    const items = await prisma.items.findMany({
      where: {
        droparias: {
          some: {
            name,
          },
        },
      },
    });
    return items
  }
}
