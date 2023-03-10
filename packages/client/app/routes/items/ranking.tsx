import type { Prisma } from "@catarks/db";
import { ITEM_TYPES } from "@catarks/utils";
import type { ErrorBoundaryComponent, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { useReducer } from "react";
import { For } from "~/components/for";
import { ItemCard } from "~/components/item/ItemCard";
import { queryReducer } from "~/reducer/itemRanking";
import { prisma } from "~/utils/prisma.server";
import { getCategoryName, searchParams } from "~/utils/utils";
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

    const items = await prisma.itemPriceAverage.findMany({
      distinct: "itemsId",
      where,
      orderBy: { createdAt: "desc" },
      include: { item: true },
    });
    const sortableItems = items.sort((a, b) => a.price - b.price);
    if (query.sort === "asc") {
      sortableItems.map((v) => {
        return { ...v.item, price: v.price };
      });
    } else {
      sortableItems.reverse().map((v) => {
        return { ...v.item, price: v.price };
      });
    }

    return json({ items: sortableItems, query });
  } catch (err) {
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
        <div className="border border-base-300 bg-base-100 rounded-box">
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
                  selected={
                    !queryState.type && query.type === type
                      ? true
                      : false || queryState.type === type
                  }
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
              selected={
                !queryState.sort && query.sort === "asc"
                  ? true
                  : false || queryState.sort === "asc"
              }
              value={"asc"}
            >
              昇順
            </option>
            ;
            <option
              selected={
                !queryState.sort && query.sort === "desc"
                  ? true
                  : false || queryState.sort === "desc"
              }
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
                  selected={
                    !queryState.ship && query.ship === i
                      ? true
                      : false || queryState.ship === i.toString()
                  }
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
        {items.map((item) => (
          <Link key={item.id} to={`/items/${item.item.id}`}>
            <ItemCard item={item.item} price={item.price} />
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
