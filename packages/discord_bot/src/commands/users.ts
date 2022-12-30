import { ORM, redis } from "../db/session.js";
import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export const UsersCommand = async () => {
  const data = new SlashCommandBuilder()
    .setName("users")
    .setDescription("ユーザーに関するコマンド")
    .addSubcommand((sub) =>
      sub
        .setName("auth")
        .setDescription("Ventとの認証を行います")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("認証したいventのユーザー名")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("verify_code")
            .setDescription("ventで表示された認証コード")
            .setRequired(true)
        )
    );

  async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const dm = interaction.user.createDM();
    (await dm).send("テストです");
    const username = interaction.options.getString("username");
    const hitCode = await redis.get(`integration_request_${username}`);
    if (hitCode === interaction.options.getString("verify_code") && username) {
      await ORM.instance().users.update({
        where: {
          username,
        },
        data: {
          discordId: interaction.user.id,
        },
      });
      await interaction.reply("認証に成功しました！");
    } else {
      await interaction.reply("認証コードが、又はユーザー名が無効です");
    }
  }

  return { data, execute };
};
