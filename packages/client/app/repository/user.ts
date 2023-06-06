import { prisma } from "~/utils/prisma.server";

export class UserRepository {

  static async getById(id: string) {
    return await prisma.users.findFirst({
      where: {
        id
      }, include: { role: true }
    }) || undefined
  }

  static async getUserCount() {
    return await prisma.users.count()
  }
}