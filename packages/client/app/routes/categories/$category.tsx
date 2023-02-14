import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { ArticleCardVertical } from "~/components/item/verticalArticleCard";
import { getCategoryName, getPaginationPageNumber, searchParams } from "~/utils/utils";
import type { PickType } from "@catarks/utils";
import { Pagination } from "flowbite-react";
import { IconSearch, IconX } from "@tabler/icons";
import { SearchItemByQuery } from "~/middlewares/search";
import { useEffect, useState } from "react";
import { useDebounce } from '@reactuses/core';

export async function loader({ params, request }: LoaderArgs) {
  const url = searchParams(request);
  const page = url.get("page") || "1";
  const q = url.get("q");
  const limit = 20;
  const skip = getPaginationPageNumber({ limit, page });
  const category = params.category as PickType<ItemDto, "type"> | undefined;
  if (!category) throw new Error();
  const res = await SearchItemByQuery({ q, limit, skip, category });
  return json({ body: res, category: params.category, page: Number(page), q });
}

export default function Category() {
  const { body, page, category, q } = useLoaderData<typeof loader>();
  const [query, setQuery] = useState<string | undefined>(q);
  const debouncedValue = useDebounce(query, 500);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedValue) {
    navigate(`/categories/${category}?q=${debouncedValue}`)
    } else {
      navigate(`/categories/${category}`)
    }
  }, [debouncedValue])

  return (
    <div className="container">
      <form className="flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
          defaultValue={query}
          onChange={(e) => setQuery(e.target.value)}
            type="search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="検索"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setQuery("")}
          >
            <IconX className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
          </button>
        </div>
      </form>
      <div className="grid justify-center grow grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-3">
        {body.hits.map((item) => (
          <div key={item.id}>
            <Link to={`/items/${item.id}`} style={{ textDecoration: "none" }}>
              <ArticleCardVertical
                image={item.iconUrl}
                category={getCategoryName('ability')}
                title={item.title}
                date=""
              />
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination
          totalPages={Math.floor(body.estimatedTotalHits / 20)}
          currentPage={page}
          onPageChange={(page) => {
            navigate(`/categories/${category}?page=${page}`, {
              preventScrollReset: true,
            });
          }}
        />
      </div>
    </div>
  );
}
