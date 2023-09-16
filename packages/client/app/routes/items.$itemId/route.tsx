import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { SITE_META_PREFIX } from "~/const";
import { getItemByID } from "~/middlewares/items";
import { ClientOnly } from "remix-utils";
import { getItemPriceChartById } from "~/middlewares/charts";
import { PriceChart } from "~/components/item/priceChart";
import type { ReactNode } from "react";
import { useEffect } from "react";
import type { TCreateItemPriceAction } from "../api.items.price";
import { toast } from "react-hot-toast";
import { ItemCard } from "~/components/item/ItemCard";
import { searchParams, useOptionalUser } from "~/utils/utils";
import {
  typedjson,
  useTypedFetcher,
  useTypedLoaderData,
} from "remix-typedjson";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ItemPrices, UserRoles, Users } from "@catarks/db";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Label } from "~/components/ui/label";

export async function loader({ params, request }: LoaderArgs) {
  const rawQuery = searchParams(request);
  const itemId = params.itemId;

  const tab = rawQuery.get("tab");
  if (typeof itemId !== "string")
    throw new Error("アイテムIdが指定されていません");
  const item = await getItemByID(itemId);
  const charts = await getItemPriceChartById(itemId);
  if (!item) throw Error("Item Not Found");
  // const ogpImage = await generateSvg({ title: item.name, image: item.iconUrl });
  return typedjson({ item, charts, tab });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => {
  return [
    { title: `${data?.item.name} - ${SITE_META_PREFIX}` },
    { charSet: "utf-8" },
    {  property: "og:title", content: `${data?.item.name} - ${SITE_META_PREFIX}` },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    // { property: "og:url", content: `https://catarks.org/items/${data.item.id}` },
    // { property: "og:image" , content: data.ogpImage },
  ];
};


// const priceRow = item.prices
//   .sort((a, b) => {
//     const dateA = a.createdAt.valueOf();
//     const dateB = b.createdAt.valueOf();
//     return dateA - dateB;
//   })
//   .reverse()
//   .map((price) => (
//     <tr key={price.id}>
//       <td>{price.price / (1 - 0.1)}</td>
//       <td>{price.price}</td>
//       <td>{price.ship}</td>
//       <td>
//         <Link
//           to={`/users/${price.reporter.id}`}
//           style={{ textDecoration: "none", color: "black" }}
//         >
//           <div className="flex items-center gap-2">
//             <img
//               src={getCDNUrl(price.reporter.avatarUrl!, {
//                 format: "webp",
//                 size: "40x40",
//               })}
//               alt={`${price.reporter.username} Avatar`}
//               className="rounded-md h-10"
//             ></img>
//             <p className="inline-block">
//               {getName(price.reporter)}
//               <span>
//                 {price.reporter.role.filter((v) => v.name === "admin") && (
//                   <IconStar
//                     className="inline-block"
//                     height={15}
//                     style={{ color: "#FFD43B" }}
//                   />
//                 )}
//               </span>
//             </p>
//           </div>
//         </Link>
//       </td>
//       <td>
//         <div className="dropdown">
//           <label tabIndex={0}>
//             <button
//               type="button"
//               className="focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//             >
//               <IconDots />
//             </button>
//           </label>
//           <ul
//             tabIndex={0}
//             className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
//           >
//             {price.reporterId === session?.user?.id && (
//               <li>
//                 <button
//                   className="text-red-400"
//                   onClick={() =>
//                     fetcher.submit(
//                       { priceId: price.id },
//                       { action: "/api/items/price", method: "delete" }
//                     )
//                   }
//                 >
//                   報告の削除
//                 </button>
//               </li>
//             )}
//             <li>
//               <button>Coming soon...</button>
//             </li>
//           </ul>
//         </div>
//       </td>
//     </tr>
//   ));

type TItempriceTableProps = ItemPrices & {
    reporter: Users & {role: UserRoles[]}
}

const ItemPriceTable = (itemPrices: TItempriceTableProps[]) =>
  itemPrices.length > 0 ? (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">売値</TableHead>
          <TableHead>純売上</TableHead>
          <TableHead>ship</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {itemPrices.map((itemPrice) => (
          <TableRow key={itemPrice.id}>
            <TableCell className="font-medium">{itemPrice.price / (1 - 0.1)}</TableCell>
            <TableCell>{itemPrice.price}</TableCell>
            <TableCell>{itemPrice.ship}</TableCell>
            <TableCell className="text-right"></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <p>まだ報告がありません</p>
  );


export default function Item() {
  const { item, charts, tab } = useTypedLoaderData<typeof loader>();
  const fetcher = useTypedFetcher<TCreateItemPriceAction>();
  const session = useOptionalUser();

  useEffect(() => {
    if (fetcher.data?.status === "success") {
      if (fetcher.data.intent === "deletePrice") {
        toast.success("削除に成功しました", {
          position: "bottom-right",
        });
      }
    }
  }, [fetcher.data]);


  const CustomCard = ({ children }: { children: ReactNode }) => {
    return (
      <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col">
        <div className="flex h-full flex-col gap-4 p-6">{children}</div>
      </div>
    );
  };
  return (
    <div style={{ margin: "8px" }}>
      <ItemCard item={item} enableCopyButton/>

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

    <Tabs defaultValue="account" >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">報告履歴</TabsTrigger>
        <TabsTrigger value="password">チャート</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>過去に報告された価格</CardTitle>
            <CardDescription>
              過去に報告された価格を確認できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
          <ItemPriceTable itemPrices={item.prices} />

          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>価格の推移</CardTitle>
            <CardDescription>
              価格の推移を確認できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
          <ClientOnly fallback={<></>}>
            {() => (
              <>
                <PriceChart chartData={charts} />
              </>
            )}
          </ClientOnly>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
        {/* {tab == undefined ? (
          <ItemPriceTable itemPrices={item.prices}/>
        ) : (
          <ClientOnly fallback={<></>}>
            {() => (
              <>
                <PriceChart chartData={charts} />
              </>
            )}
          </ClientOnly>
        )} */}
    </div>
  );
}
