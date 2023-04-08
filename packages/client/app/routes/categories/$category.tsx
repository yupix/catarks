import type { LoaderArgs } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { getPaginationPageNumber, searchParams } from "~/utils/utils";
import { IconSearch, IconX } from "@tabler/icons";
import { SearchItemByQuery } from "~/middlewares/search";
import { useEffect, useState } from "react";
import { useDebounce } from "@reactuses/core";
import { ItemCard } from "~/components/item/ItemCard";
import { CatPagination } from "~/components/common/CatPagination";
import type { ItemTypes } from "@catarks/db";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export async function loader({ params, request }: LoaderArgs) {
  const url = searchParams(request);
  const page = url.get("page") || "1";
  const q = url.get("q");
  const limit = 20;
  const skip = getPaginationPageNumber({ limit, page });
  const category = params.category as ItemTypes | undefined;
  if (!category) throw new Error();
  const res = await SearchItemByQuery({ q, limit, skip, category });
  return typedjson({ body: res, category: params.category, page: Number(page), q });
}

export default function Category() {
  const { body, page, category, q } = useTypedLoaderData<typeof loader>();
  const [query, setQuery] = useState<string | undefined>(q);
  const debouncedValue = useDebounce(query, 500);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (debouncedValue) {
      setSearchParams({ q: debouncedValue, page: page.toString() });
    } else if (page) {
      setSearchParams({ page: page.toString() });
    }
  }, [debouncedValue]);

  return (
    <div className="">
      <form className="flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            defaultValue={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="アイテム名で検索"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label="検索条件を削除"
            onClick={() => setQuery("")}
          >
            <IconX className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
          </button>
        </div>
      </form>
      <div className="mt-5 grid justify-center grow grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-3">
        {body.hits.map((item) => (
          <div key={item.id}>
            <Link to={`/items/${item.id}`} style={{ textDecoration: "none" }}>
              <ItemCard item={item} />
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <CatPagination
          totalPages={Math.ceil(body.estimatedTotalHits! / 20)}
          currentPage={page}
          pageRangeDisplayed={3}
          onChange={(page) => {
            if (debouncedValue) {
              setSearchParams({ page: page.toString(), q: debouncedValue });
            } else {
              setSearchParams({ page: page.toString() });
            }
          }}
        ></CatPagination>
      </div>
    </div>
  );
}
