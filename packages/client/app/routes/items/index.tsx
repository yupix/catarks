import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import { assertIsDefined } from "~/utils/utils";

export async function loader() {
  const prices = await prisma.itemPriceAverage.groupBy({
    by: ["itemsId"],
    where: {
      ship: 0
    },
    _max: {
      price: true,
    },
    orderBy: {
      _max: {
        price: "desc",
      },
    },
  });
  const items = await Promise.all(
    prices.map(async (price) => {
      const item = await prisma.items.findFirst({
        where: { id: price.itemsId },
      });
      assertIsDefined(item);
      return { ...item, price: price._max.price };
    })
  );
  return json(items);
}

export default function ItemsIndex() {
  const items = useLoaderData<typeof loader>();
  return (
    <div className="block sm:flex gap-3">
      {items.map((item, i) => (
        <Link
          key={item.id}
          to={`/items/${item.id}`}
          className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <img className="w-32 h-32 rounded-lg" src={item.iconUrl} alt={`${item.name} Icon`} />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {i+1}位: {item.name}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex">
              <img src="https://s3.akarinext.org/assets/*/pso2/n.webp"/> {item.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
