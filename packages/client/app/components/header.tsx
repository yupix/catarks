import { Form, Link } from "@remix-run/react";
import { IconMenu2 } from "@tabler/icons";
import { useSnapshot } from "valtio";
import { useSessionState } from "~/states/common";
import { Button } from "flowbite-react";

export const DefaultHeader = () => {
  const user = useSnapshot(useSessionState).user;
  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <div className="alert bg-red-500 text-white rounded-none">
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
          {user ? (
            <div className="flex items-center">
              <div className="pl-2" />
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={user.avatarUrl} />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to={`/users/${user.id}`} className="justify-between">
                      プロフィール
                    </Link>
                  </li>
                  <li>
                    <Form action="/auth/auth0/logout" method="post">
                      <button type="submit">ログアウト</button>
                    </Form>
                  </li>
                  <li>
                    <Link to="/settings" className="justify-between">
                      設定<span className="badge">New</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Form action="/auth/auth0" method="post">
              <Button size="xs" type="submit">
                ログイン
              </Button>
            </Form>
          )}
        </div>
      </div>
    </>
  );
};
