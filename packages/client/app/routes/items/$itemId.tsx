import {
  Avatar,
  Text,
  Group,
  Space,
} from "@mantine/core";
import { Tabs, Table } from "flowbite-react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArticleCardVertical } from "~/components/item/verticalArticleCard";
import { SITE_META_PREFIX } from "~/const";
import { getItemByID } from "~/middlewares/items";
import { generateSvg } from "~/utils/og.server";
import { getCategoryName } from "~/utils/utils";
import { ClientOnly } from "remix-utils";
import { getItemPriceChartById } from "~/middlewares/charts";
import { PriceChart } from "~/components/item/priceChart";
import { IconStar } from "@tabler/icons";
import type { ReactNode } from "react";

export async function loader({ params }: LoaderArgs) {
  const itemId = params.itemId;
  if (typeof itemId !== "string")
    throw new Error("アイテムIdが指定されていません");

  const item = await getItemByID(itemId);
  const charts = await getItemPriceChartById(itemId);
  if (!item) throw Error("Item Not Found");
  const ogpImage = await generateSvg({ title: item.name });
  return json({ item, ogpImage, charts });
}

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return {
    title: `${data.item.name} - ${SITE_META_PREFIX}`,
    charset: "utf-8",
    "og:title": `${data.item.name} - ${SITE_META_PREFIX}`,
    "og:url": `https://catarks.org/items/${data.item.id}`,
    "og:image": data.ogpImage,
  };
};

export default function Item() {
  const { item, charts } = useLoaderData<typeof loader>();

  const priceThs = (
    <Table.Head>
      <Table.HeadCell>値段</Table.HeadCell>
      <Table.HeadCell>報告者</Table.HeadCell>
    </Table.Head>
  );
  const priceRow = item.prices
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).valueOf();
      const dateB = new Date(b.createdAt).valueOf();
      return dateA - dateB;
    })
    .reverse()
    .map((price) => (
      <Table.Row key={price.id}>
        <Table.Cell>{price.price}</Table.Cell>
        <Table.Cell>
          <Link
            to={`/users/${price.reporter.id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Group align="center">
              <Avatar src={price.reporter.avatarUrl} radius="sm"></Avatar>
              {price.reporter.username}
              {price.reporter.role.filter((v) => v.name === "admin") && (
                <IconStar height={15} style={{ color: "#FFD43B" }} />
              )}
            </Group>
          </Link>
        </Table.Cell>
      </Table.Row>
    ));

  const CustomCard = ({ children }: { children: ReactNode }) => {
    return (
      <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col">
        <div className="flex h-full flex-col gap-4 p-6">{children}</div>
      </div>
    );
  };

  return (
      <div style={{ margin: "8px" }}>
        <ArticleCardVertical
          image={item.iconUrl}
          category={getCategoryName(item.type)}
          title={item.name}
          date=""
        />
        <Space h="lg" />
        <div className="grid grid-cols-2 gap-4">
          <CustomCard>
            <h2 className="font-bold text-lg">
              入手方法
            </h2>
            <ul>
              {item.droparias.map((aria) => (
                <li key={aria.name}>{aria.name}</li>
              ))}
            </ul>
          </CustomCard>
          {item.type == "ability" && (
            <CustomCard>
              <h2 className="font-bold text-lg">
                効果
              </h2>
              {item?.ability?.effects.map((effect) => (
                <div key={effect.name}>{effect.name}</div>
              ))}
            </CustomCard>
          )}
        </div>
        <Space h="lg" />
        <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col">
          <Tabs.Group defaultValue="prices">
            <Tabs.Item title="価格">
              {item.prices.length > 0 ? (
                <Table striped>
                  {priceThs}
                  <Table.Body>{priceRow}</Table.Body>
                </Table>
              ) : (
                <Text>まだ報告が存在しないようです</Text>
              )}
            </Tabs.Item>
            <Tabs.Item title="チャート">
              <ClientOnly fallback={<></>}>
                {() => (
                  <>
                    <PriceChart chartData={charts} />
                  </>
                )}
              </ClientOnly>
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
  );
}
