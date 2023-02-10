import { Link } from "@remix-run/react";
import { AUTHORS } from "~/assets/data/authors";
import { Footer } from "~/components/Footer";

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

export default function Index() {
  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              簡単な相場管理
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              CatArksはPhantasy Start Online 2 New
              Genesisの現役プレイヤーが開発しているマイショップの相場管理サイトです
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              始める
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
          <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              DEV TEAM
            </h2>
            <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
              このサイトを作っているメンバーを紹介します
            </p>
          </div>
          <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
            {AUTHORS.map((author) => {
              return (
                <div
                  className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700"
                  key={author.name}
                >
                  <a href="#">
                    <img
                      className="min-w-full max-w-full rounded-lg sm:rounded-none sm:rounded-l-lg sm:max-w-small"
                      src={author.avatarUrl}
                      alt={`${author.name} Avatar`}
                    />
                  </a>
                  <div className="p-5">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      <a href="#">{author.name}</a>
                    </h3>
                    <span className="text-gray-500 dark:text-gray-400">
                      {author.role}
                    </span>
                    <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                      {author.description}
                    </p>
                    <ul className="flex space-x-4 sm:mt-0">
                      {author.social.map((social) => {
                        return (
                          <li key={social.name}>
                            <a
                              href={social.link}
                              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            >
                              <social.icon />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <div style={{ height: 400 }} />
      <Footer />
    </div>
  );
}
