import { prisma } from "~/utils/prisma.server";

export async function getUserFromId(userId: string) {
  return await prisma.users.findFirst({where: {
    id: userId
  }, include: {role: true}}) || undefined
}