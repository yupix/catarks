import { prisma } from "~/utils/prisma.server";

export class UserRepository {
  
  static async getUserCount () {
    return await prisma.users.count()
  }
}