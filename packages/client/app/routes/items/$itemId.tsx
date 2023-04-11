import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { SITE_META_PREFIX } from "~/const";
import { getItemByID } from "~/middlewares/items";
import { generateSvg } from "~/utils/og.server";
import { ClientOnly } from "remix-utils";
import { getItemPriceChartById } from "~/middlewares/charts";
import { PriceChart } from "~/components/item/priceChart";
import { IconDots, IconStar } from "@tabler/icons";
import type { ReactNode } from "react";
import { useEffect } from "react";
import type { TCreateItemPriceAction } from "../api/items/price";
import { useSessionState } from "~/states/common";
import { toast } from "react-hot-toast";
import { ItemCard } from "~/components/item/ItemCard";
import { getCDNUrl, getName, searchParams } from "~/utils/utils";
import { useAtom } from "jotai";
import {
  typedjson,
  useTypedFetcher,
  useTypedLoaderData,
} from "remix-typedjson";
import { Card } from "~/components/common/Card";

export async function loader({ params, request }: LoaderArgs) {
  const rawQuery = searchParams(request);
  const itemId = params.itemId;

  const tab = rawQuery.get("tab");
  console.log(tab);
  if (typeof itemId !== "string")
    throw new Error("アイテムIdが指定されていません");
  const item = await getItemByID(itemId);
  const charts = await getItemPriceChartById(itemId);
  if (!item) throw Error("Item Not Found");
  const ogpImage = await generateSvg({ title: item.name });
  return typedjson({ item, ogpImage, charts, tab });
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
  const { item, charts, tab } = useTypedLoaderData<typeof loader>();
  const fetcher = useTypedFetcher<TCreateItemPriceAction>();
  const [session] = useAtom(useSessionState);

  useEffect(() => {
    if (fetcher.data?.status === "success") {
      if (fetcher.data.intent === "deletePrice") {
        toast.success("削除に成功しました", {
          position: "bottom-right",
        });
      }
    }
  }, [fetcher.data]);

  const priceThs = (
    <thead>
      <tr>
        <th className="bg-base-300">売値</th>
        <th className="bg-base-300">純売上</th>
        <th className="bg-base-300">ship</th>
        <th className="bg-base-300">報告者</th>
        <th className="bg-base-300"></th>
      </tr>
    </thead>
  );
  const priceRow = item.prices
    .sort((a, b) => {
      const dateA = a.createdAt.valueOf();
      const dateB = b.createdAt.valueOf();
      return dateA - dateB;
    })
    .reverse()
    .map((price) => (
      <tr key={price.id}>
        <td>{price.price / (1 - 0.1)}</td>
        <td>{price.price}</td>
        <td>{price.ship}</td>
        <td>
          <Link
            to={`/users/${price.reporter.id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="flex items-center gap-2">
              <img
                src={getCDNUrl(price.reporter.avatarUrl!, {
                  format: "webp",
                  size: "40x40",
                })}
                alt={`${price.reporter.username} Avatar`}
                className="rounded-md h-10"
              ></img>
              <p className="inline-block">
                {getName(price.reporter)}
                <span>
                  {price.reporter.role.filter((v) => v.name === "admin") && (
                    <IconStar
                      className="inline-block"
                      height={15}
                      style={{ color: "#FFD43B" }}
                    />
                  )}
                </span>
              </p>
            </div>
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
              {price.reporterId === session?.user?.id && (
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
              )}
              <li>
                <button>Coming soon...</button>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    ));

  const ItemPricies = () =>
    item.prices.length > 0 ? (
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="table w-full">
          {priceThs}
          <tbody>{priceRow}</tbody>
        </table>
      </div>
    ) : (
      <p>まだ報告が存在しないようです</p>
    );

  const CustomCard = ({ children }: { children: ReactNode }) => {
    return (
      <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col">
        <div className="flex h-full flex-col gap-4 p-6">{children}</div>
      </div>
    );
  };
  return (
    <div style={{ margin: "8px" }}>
      <ItemCard item={item} />

      <div className="h-5" />
      <div className="grid grid-cols-2 gap-4">
        <CustomCard>
          <h2 className="font-bold text-lg">入手方法</h2>
          <ul>
            {item.droparias.map((aria) => (
              <li key={aria.name}>
                <Link to={`/arias/${aria.name}`}>{aria.name}</Link>
              </li>
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
      <div className="h-5" />
      <Card
        headerChildren={
          <div className="tabs bg-base-300 rounded-t-md">
            <Link
              to={`/items/${item.id}`}
              className={"tab tab-bordered " + (!tab && "tab-active")}
            >
              価格
            </Link>
            <Link
              to={`/items/${item.id}?tab=chart`}
              className={
                "tab tab-bordered " + (tab === "chart" && "tab-active")
              }
            >
              チャート
            </Link>
          </div>
        }
      >
        {tab == undefined ? (
          <ItemPricies />
        ) : (
          <ClientOnly fallback={<></>}>
            {() => (
              <>
                <PriceChart chartData={charts} />
              </>
            )}
          </ClientOnly>
        )}
      </Card>
    </div>
  );
}
