import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { ArticleCardVertical } from "~/components/item/verticalArticleCard";
import { getCategoryName, getPaginationPageNumber } from "~/utils/utils";
import type { PickType } from "@catarks/utils";
import { getItems } from "~/middlewares/items";
import { Pagination } from "flowbite-react";
export async function loader({ params, request }: LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const limit = 20;
  const skip = getPaginationPageNumber({ limit, page });
  const category = params.category as PickType<ItemDto, "type"> | undefined;
  if (!category) throw new Error();
  const res = await getItems({ limit, skip, type: category });
  return json({ body: res, category: params.category, page: Number(page) });
}

export default function Category() {
  const { body, page, category } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="grid justify-center grow grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-3">
        {body.items.map((item) => (
          <div key={item.id}>
            <Link to={`/items/${item.id}`} style={{ textDecoration: "none" }}>
              <ArticleCardVertical
                author={{
                  name: item.ItemPriceAverage[0]?.price
                    ? item.ItemPriceAverage[0].price.toString()
                    : "0",
                  avatar: "https://s3.akarinext.org/assets/*/pso2/n.webp",
                }}
                image={item.iconUrl}
                category={getCategoryName(item.type)}
                title={item.name}
                date=""
              />
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination
          totalPages={Math.floor(body.max / 20)}
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
