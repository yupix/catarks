import { validatePrice } from "@/utils/validate.js";
import { ORM } from "@/db/session.js";
import {
  AutocompleteInteraction,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getUserIdtoProfile } from "@/middlewares/user.js";
import { getItemIdfromPrice } from "@/middlewares/price.js";
import { ItemActions } from "@/middlewares/item.js";
import { Logger, PickType, TYPE_TO_CATEGORY } from "@catarks/shared";
import { Pagination } from "pagination.djs";
import { api } from "@/utils/api.js";

export const ItemsCommand = async () => {
  const items = (await ORM.instance().items.findMany()).map((item) => {
    return { name: item.name, value: item.id };
  });

  const logger = Logger.getInstance;

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
    )
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("アイテムの一覧を表示")
        .addStringOption((option) =>
          option
            .setName("カテゴリー")
            .setDescription("調べたいアイテムのカテゴリー")
            .setRequired(true)
            .addChoices(
              { name: "特殊能力", value: "ability" },
              { name: "武器", value: "weapon" }
            )
        )
    );
  async function execute(interaction: ChatInputCommandInteraction<"cached">) {
    console.debug(interaction.isAutocomplete());
    console.debug(interaction.options.getSubcommand());
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
                timestamp: new Date(price.createdAt).toISOString(),
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
        await interaction.reply("取得が完了しました");
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
        } catch (err) {
          logger.error(err);
          await interaction.reply(String(err));
        }
      case "list":
        try {
          type TCategory = PickType<ItemDto, "type">;
          const itemListPages = new Pagination(interaction, {
            ephemeral: true,
            buttonStyle: ButtonStyle.Primary,
          });
          const category =
            (interaction.options.getString("カテゴリー") as TCategory) ||
            "ability";
          if (!category) throw new Error("意味わからん");
          const listEmbeds: EmbedBuilder[] = [];
          let offset = 0;
          const limit = 20;
          const res = await api.call("GET", "/api/items", {
            query: { type: category },
          });
          const status = res.status?.toString() || "unknown";
          if (res.type === "failed") {
            throw new Error(`NetworkException: apiCallError: ${status}`);
          }
          const createOffset = (_offset: number = offset) => {
            return (_offset = 0 ? 0 : _offset);
          };
          const getThumbnail = (_category: TCategory) => {
            if ((_category = "ability")) {
              return "https://s3.akarinext.org/assets/*/pso2/op/op_2.webp";
            } else if ((_category = "weapon")) {
              return "https://s3.akarinext.org/assets/*/pso2/op/op_2.webp";
            } else {
              return "";
            }
          };

          while (true) {
            const embed = new EmbedBuilder()
              .setColor(0x2196f3)
              .setTitle(`${TYPE_TO_CATEGORY[category]}のアイテムリスト`)
              .setURL(`https://catarks.org/categories/${category}`)
              .setThumbnail(getThumbnail(category));

            let fields = res.data.items
              .slice(limit * createOffset(), limit * createOffset(offset + 1))
              .map((item, i) => {
                let _effect = "";
                item.ability.effects.map((effect) => {
                  _effect += `${effect.name}, `;
                });
                return {
                  name: item.name,
                  value: _effect.slice(0, -2),
                };
              });
            embed.addFields(fields);
            fields = [];
            listEmbeds.push(embed);
            itemListPages.setEmbeds(listEmbeds, (embed, index, array) => {
              return embed.setFooter({
                text: `Page: ${index + 1}/${array.length}`,
              });
            });
            offset++;
            if (limit * createOffset() >= res.data.max) break;
          }
          // TODO: readyにして変数に突っ込んでリプライ返すときに他人に見えないように
          itemListPages.render();
          //throw new Error("内容は無いそうです");
        } catch (err) {
          logger.error(err);
          await interaction.reply(String(err));
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
