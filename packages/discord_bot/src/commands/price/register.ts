import { ORM } from "../../db/session.js";
import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export const PriceRegister = async () => {
  const items = (await ORM.instance().items.findMany()).map((item) => {
    return { name: item.name, value: item.name };
  });

  const data = null;
  async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    console.log(interaction.isAutocomplete());
    const item = interaction.options.getString("アイテム名");
    const price = interaction.options.getNumber("値段");
    await interaction.reply("Pong! :ping_pong:" + item + price);
  }

  async function autocomplete(interaction: AutocompleteInteraction<CacheType>) {
    const findItems = items.filter((item) =>
      item.name.includes(interaction.options.getFocused())
    );

    // 最初に見つかった25個までに絞らないとAPI的にエラーが出て落ちてしまう
    await interaction.respond(findItems.slice(0, 24).map((item) => item));
  }

  return { data, execute, autocomplete };
};
