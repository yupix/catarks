import { Avatar, Text, Group, Space } from "@mantine/core";
import { Tabs } from "flowbite-react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { ArticleCardVertical } from "~/components/item/verticalArticleCard";
import { SITE_META_PREFIX } from "~/const";
import { getItemByID } from "~/middlewares/items";
import { generateSvg } from "~/utils/og.server";
import { getCategoryName } from "~/utils/utils";
import { ClientOnly } from "remix-utils";
import { getItemPriceChartById } from "~/middlewares/charts";
import { PriceChart } from "~/components/item/priceChart";
import { IconDots, IconStar } from "@tabler/icons";
import type { ReactNode } from "react";
import { useEffect } from "react";
import type { TCreateItemPriceAction } from "../api/items/price";
import { useSessionState } from "~/states/common";
import { useSnapshot } from "valtio";
import { toast } from "react-hot-toast";

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
  const fetcher = useFetcher<TCreateItemPriceAction>();
  const { user } = useSnapshot(useSessionState);

  useEffect(() => {
    console.log(fetcher.data);
    if (fetcher.data?.status === "success") {
      if (fetcher.data.intent === "deletePrice") {
        toast.success("削除に成功しました", {
          position: "bottom-right"
        });
      }
    }
  }, [fetcher.data]);

  const priceThs = (
    <thead>
      <th>値段</th>
      <th>報告者</th>
      <th></th>
    </thead>
  );
  const priceRow = item.prices
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).valueOf();
      const dateB = new Date(b.createdAt).valueOf();
      return dateA - dateB;
    })
    .reverse()
    .map((price) => (
      <tr key={price.id}>
        <td>{price.price}</td>
        <td>
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
        </td>
        <td>
          <div className="dropdown">
            <label tabIndex={0}>
              <button
                type="button"
                className="focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <IconDots />
              </button>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button
                  className="text-red-400"
                  onClick={() =>
                    fetcher.submit(
                      { priceId: price.id },
                      { action: "/api/items/price", method: "delete" }
                    )
                  }
                >
                  報告の削除
                </button>
              </li>
              <li>
                <button>Coming soon...</button>
              </li>
            </ul>
          </div>
        </td>
      </tr>
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
          <h2 className="font-bold text-lg">入手方法</h2>
          <ul>
            {item.droparias.map((aria) => (
              <li key={aria.name}>{aria.name}</li>
            ))}
          </ul>
        </CustomCard>
        {item.type == "ability" && (
          <CustomCard>
            <h2 className="font-bold text-lg">効果</h2>
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
                <table className="table w-full">
                  {priceThs}
                  <tbody>{priceRow}</tbody>
                </table>
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
