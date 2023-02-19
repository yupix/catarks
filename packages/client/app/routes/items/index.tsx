import type { Prisma } from "@catarks/db";
import { ITEM_TYPES } from "@catarks/utils";
import type { ErrorBoundaryComponent, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { useReducer, useState } from "react";
import { For } from "~/components/for";
import { queryReducer } from "~/reducer/itemRanking";
import { prisma } from "~/utils/prisma.server";
import { assertIsDefined, getCategoryName, searchParams } from "~/utils/utils";
import { validateItemRankingQuery } from "~/validations/items/index.query";

export async function loader({ request }: LoaderArgs) {
  const rawQuery = searchParams(request);
  const type = rawQuery.get("type");
  const ship = rawQuery.get("ship");
  const sort = rawQuery.get("sort");
  const where: Prisma.ItemPriceAverageWhereInput = {
    ship: 0,
  };
  try {
    const query = validateItemRankingQuery.parse({ type, ship, sort });

    if (query.ship) where["ship"] = query.ship;
    if (query.type) where["item"] = { type: query.type };

    const prices = await prisma.itemPriceAverage.groupBy({
      by: ["itemsId"],
      where,
      _max: {
        price: true,
      },
      orderBy: {
        _max: {
          price: query.sort,
        },
      },
    });
    const items = await Promise.all(
      prices.map(async (price) => {
        const item = await prisma.items.findFirst({
          where: { id: price.itemsId },
        });
        assertIsDefined(item);
        return { ...item, price: price._max?.price };
      })
    );
    return json({ items, query });
  } catch (err) {
    console.log(err);
    throw Error("Invalidate Query");
  }
}

export default function ItemsIndex() {
  const { items, query } = useLoaderData<typeof loader>();

  const [queryState, dispatch] = useReducer(queryReducer, {});
  const [searchParams, setSearchParams] = useSearchParams();

  const Search = () => {
    return (
      <div>
        <div
          className="border border-base-300 bg-base-100 rounded-box"
        >
            <select
              className="select select-bordered w-full max-w-xs"
              onChange={(v) =>
                dispatch({ type: "UPDATE_TYPE", payload: v.target.value })
              }
            >
              <option disabled selected={query.type ? false : true}>
                カテゴリ
              </option>
              {ITEM_TYPES.map((type) => {
                return (
                  <option
                    key={type}
                    selected={!queryState.type && query.type === type ? true : false || queryState.type === type}
                    value={type}
                  >
                    {getCategoryName(type)}
                  </option>
                );
              })}
            </select>
            <select
              className="ml-2 select select-bordered w-full max-w-xs"
              onChange={(v) =>
                dispatch({ type: "UPDATE_SORT", payload: v.target.value })
              }
            >
              <option disabled selected={query.type ? false : true}>
                表示順序
              </option>
              <option
                selected={!queryState.sort &&  query.sort === "asc" ? true : false || queryState.sort === 'asc'}
                value={"asc"}
              >
                昇順
              </option>
              ;
              <option
                selected={!queryState.sort && query.sort === "desc" ? true : false || queryState.sort === 'desc'}
                value={"desc"}
              >
                降順
              </option>
              ;
            </select>
            <select
              className="ml-2 select select-bordered w-full max-w-xs"
              onChange={(v) =>
                dispatch({ type: "UPDATE_SHIP", payload: v.target.value })
              }
            >
              <option disabled selected={query.type ? false : true}>
                ship
              </option>
              <For v={[0, (i) => i < 11, (i) => i + 1]}>
                {(i) => (
                  <option
                    key={i}
                    selected={!queryState.ship && query.ship === i ? true : false || queryState.ship === i.toString()}
                    value={i}
                  >
                    {i === 0 ? "全て" : i}
                  </option>
                )}
              </For>
            </select>
            <button
              className="ml-2 btn btn-primary"
              onClick={() => setSearchParams(queryState)}
            >
              検索
            </button>
          </div>
        </div>
    );
  };

  return (
    <div>
      <Search />
      <div className="h-5" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <Link
            key={item.id}
            to={`/items/${item.id}`}
            className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              className="w-32 h-32 rounded-lg"
              src={item.iconUrl}
              alt={`${item.name} Icon`}
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {i + 1}位: {item.name}
              </h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex">
                <img src="https://s3.akarinext.org/assets/*/pso2/n.webp" />{" "}
                {item.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <div className="flex items-center">
      {error.message === "Invalidate Query" &&
        "エラーが発生しました。存在しないカテゴリを使用した可能性があります"}
    </div>
  );
};
