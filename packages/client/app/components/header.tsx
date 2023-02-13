import { ActionIcon, Tooltip } from "@mantine/core";
import { Form, Link, useLocation } from "@remix-run/react";
import { IconPencil } from "@tabler/icons";
import { useSnapshot } from "valtio";
import { useModalState, useSessionState } from "~/states/common";
import { Button } from "flowbite-react";

export const DefaultHeader = () => {
  const user = useSnapshot(useSessionState).user;
  const location = useLocation();
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
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li tabIndex={0}>
                <a className="justify-between">
                  Parent
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                </a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            Cat Arks
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">TOP</Link>
            </li>

            <li>
              <Link to="/categories">CATEGORIES</Link>
            </li>
          </ul>
        </div>
        <div className="flex md:order-2 navbar-end">
          {user ? (
            <div className="flex items-center">
              <Tooltip label="価格を報告する">
                <ActionIcon
                  variant="default"
                  onClick={() => {
                    useModalState.isOpenedPriceRepost = true;
                  }}
                >
                  <IconPencil size={16} />
                </ActionIcon>
              </Tooltip>
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
                      プロフィール<span className="badge">New</span>
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
