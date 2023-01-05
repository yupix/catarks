import { ORM } from "@/db/session.js";

export async function getUserIdtoProfile(discordId: string) {
  /**
   * 指定したDiscordのユーザーIdからcatarksのユーザーを取得します
   *
   * @async
   * @function
   * @param {discordId} string - 取得するユーザーのDiscordId
   * @returns {Users | null} - ユーザーのプロフィール、存在しない場合はnull
   */

  return await ORM.instance().users.findFirst({
    where: {
      discordId,
    },
  });
}
