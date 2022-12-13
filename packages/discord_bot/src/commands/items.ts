import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("items")
    .setDescription("アイテムに関するもの")
    .addSubcommand((sub) =>
      sub
        .setName("price")
        .setDescription("値段を取得します")
        .addStringOption((option) =>
          option
            .setName("アイテム名")
            .setDescription("価格を取得したいアイテム")
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.reply("Pong! :ping_pong:");
  },
};
