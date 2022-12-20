import { ORM } from "../db/session.js";
import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export const ItemsCommand = async () => {
  const items = (await ORM.instance().items.findMany()).map((item) => {
    return { name: item.name, value: item.name };
  });

  const data = new SlashCommandBuilder()
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
            .setAutocomplete(true)
        )
    );
  async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    console.log(interaction.isAutocomplete());
    await interaction.reply("Pong! :ping_pong:");
  }

  async function autocomplete(
    interaction: AutocompleteInteraction<CacheType>
  ) {
    const findItems = items.filter((item) => item.name.includes(interaction.options.getFocused()));
    
    // 最初に見つかった25個までに絞らないとAPI的にエラーが出て落ちてしまう
    await interaction.respond(findItems.slice(0,24).map((item) => item))
  }

  return { data, execute, autocomplete };
};
