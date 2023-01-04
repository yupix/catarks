import { validatePrice } from "../utils/validate.js";
import { ORM } from "../db/session.js";
import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { getUserIdtoProfile } from "../middlewares/user.js";
import { getItemIdfromPrice } from "../middlewares/price.js";
import { ItemActions } from "../middlewares/item.js";

export const ItemsCommand = async () => {
  const items = (await ORM.instance().items.findMany()).map((item) => {
    return { name: item.name, value: item.id };
  });

  const data = new SlashCommandBuilder()
    .setName("items")
    .setDescription("アイテムに関するもの")
    .addSubcommandGroup((group) =>
      group
        .setName("price")
        .setDescription("アイテムの値段に関する物")
        .addSubcommand((sub) =>
          sub
            .setName("get")
            .setDescription("指定したアイテムの価格を取得します")
            .addStringOption((option) =>
              option
                .setName("アイテム名")
                .setDescription("価格を取得したいアイテム")
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("register")
            .setDescription("アイテムの値段を登録")
            .addStringOption((option) =>
              option
                .setName("アイテム名")
                .setDescription("価格を設定したいアイテム")
                .setRequired(true)
                .setAutocomplete(true)
            )
            .addNumberOption((option) =>
              option
                .setName("値段")
                .setDescription("設定したい価格")
                .setRequired(true)
            )
        )
    );
  async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    console.log(interaction.isAutocomplete());
    console.log(interaction.options.getSubcommand());
    switch (interaction.options.getSubcommand()) {
      case "get":
        const itemId = interaction.options.getString("アイテム名");
        const user = await getUserIdtoProfile(interaction.user.id);
        const limit = user ? 25 : undefined;
        if (!itemId) throw new Error("ItemId NotFound");
        const prices = await getItemIdfromPrice(itemId, limit);

        if (prices.length === 0) {
          await interaction.reply("価格が報告されていません");
          break;
        }
        const item = await ItemActions.getfromId(itemId);
        if (!item) throw new Error("item is not found");
        prices.map((price) => {
          interaction.channel?.send({
            embeds: [
              {
                author: {
                  name: price.reporter.username,
                  url: `https://catarks.org/users/${price.reporterId}`,
                  icon_url: price.reporter.avatarUrl || undefined,
                },
                title: item.name,
                url: `https://catarks.org/items/${itemId}`,
                color: 0x2196f3,
                timestamp: price.createdAt.toISOString(),
                thumbnail: {
                  url: item.iconUrl,
                },
                fields: [
                  {
                    name: "価格",
                    value: `${price.price}N`,
                  },
                ],
                footer: {
                  text: user ? "" : "ログインすることで表示件数を増やせます！",
                },
              },
            ],
          });
        });
        break;
      case "register":
        try {
          const item = interaction.options.getString("アイテム名");
          const price = interaction.options.getNumber("値段");
          const user = await getUserIdtoProfile(interaction.user.id);
          const vp = validatePrice(price);
          if (user == null) throw new Error("Unauthorized");
          await interaction.reply(
            `\`\`${item}\`\`を\`\`${vp}N\`\`に設定しました。`
          );
        } catch (e) {
          await interaction.reply(String(e));
        }
    }
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
