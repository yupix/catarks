import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const UsersCommand = async () => {
  const data = new SlashCommandBuilder()
    .setName("users")
    .setDescription("ユーザーに関するコマンド")
    .addSubcommand((sub) =>
      sub.setName("auth").setDescription("Ventとの認証を行います")
    );

    async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
      const dm = interaction.user.createDM()
      ;(await dm).send('テストです')
      interaction.reply('DMに認証方法を送信しました')
    }
  
  return {data, execute};
};
