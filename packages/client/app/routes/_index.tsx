import { Link } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Footer } from "~/components/Footer/Footer";
import { ItemCard } from "~/components/item/ItemCard";
import { getRecentItemPriceList } from "~/middlewares/items";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { getName } from "~/utils/utils";
import { UserRepository } from "~/repository/user";
import { PriceRepository } from "~/repository/price";
import { Button } from "~/components/ui/button";

export function links() {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap",
    },

  ];
}

export async function loader() {
  const priceList = await getRecentItemPriceList(30);
  const userCount = await UserRepository.getUserCount()
  const priceCount = await PriceRepository.getPriceCount()
  return typedjson({ priceList, userCount, priceCount });
}

export default function Index() {
  const { priceList, userCount, priceCount } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <section className="bg-base-100">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              CatArks
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              CatArksはPhantasy Start Online 2 New
              Genesisの現役プレイヤーが開発しているマイショップの相場管理サイトです
            </p>
            <Button type="button" asChild>
            <Link to="/categories">
              始める
            </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-base-300">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
          <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold ">
              RECENT REPORT
            </h2>
            <span>
            今までに {userCount} 人のアークスが合計 {priceCount} 個の報告をしました

            </span>
          </div>
          <Swiper
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 50,
              },
            }}
            loop
            autoplay
            spaceBetween={10}
            navigation
            preventInteractionOnTransition={true}
            modules={[Navigation, Autoplay]}
            className="mySwiper"
            style={{padding: 10, cursor: "grabbing"}}
          >
            {priceList.map((price) => (
              <SwiperSlide key={price.id}>
                <div className="cat-effect-hover">
                  <Link to={`/items/${price.itemId}`}>
                <ItemCard
                  item={price.item}
                  price={price.price}
                  reporter={price.reporter}
                >
                  <ItemCard.Reporter>報告者: {getName(price.reporter)}</ItemCard.Reporter>
                  <ItemCard.ReportDate>報告日: {price.createdAt.toDateString()}</ItemCard.ReportDate>
                  </ItemCard>
                </Link>
              </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <div style={{ height: 400 }} />
      <Footer />
    </div>
  );
}
