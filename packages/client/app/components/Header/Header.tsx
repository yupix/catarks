import { Form, Link } from "@remix-run/react";
import { IconMenu2 } from "@tabler/icons";
import { useAtom } from "jotai";
import { useSessionState } from "~/states/common";
import { getCDNUrl } from "~/utils/utils";

export function Header() {
  const [session] = useAtom(useSessionState);
  return (
    <>
      {process.env.NODE_ENV === "development" ? (
        <div className="alert bg-error text-neutral rounded-none">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              開発者モードを使用しています。これを本番環境で使用しないでください
            </span>
          </div>
        </div>
      ) : (
        <div className="alert bg-info text-neutral rounded-none">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>

            <span>
              このサイトは現在開発中です。データのリセット等がある場合があります。ご了承ください
            </span>
          </div>
        </div>
      )}
      <div className="sticky w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 navbar bg-base-100">
        <div className="navbar-start">
          <label
            htmlFor="drawer"
            className="btn btn-square btn-ghost drawer-button lg:hidden"
          >
            <IconMenu2 />
          </label>
        </div>
        <div className="flex md:order-2 navbar-end">
          {session?.user ? (
            <div className="flex items-center">
              <div className="pl-2" />
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={getCDNUrl(session?.user.avatarUrl!, {
                        format: "webp",
                        size: "40x40",
                      })}
                      alt="Avatar"
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link
                      to={`/users/${session?.user.id}`}
                      className="justify-between"
                    >
                      プロフィール
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" className="justify-between">
                      設定
                    </Link>
                  </li>
                  <li>
                    <Link to="/my/drive" className="justify-between">
                      ドライブ<span className="badge">New</span>
                    </Link>
                  </li>
                  <li>
                    <Form action="/auth/auth0/logout" method="post">
                      <button type="submit">ログアウト</button>
                    </Form>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Form action="/auth/auth0" method="post">
              <button className="btn" type="submit">
                ログイン
              </button>
            </Form>
          )}
        </div>
      </div>
    </>
  );
}
