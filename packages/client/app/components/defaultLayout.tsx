import type { FC } from "react";
import React from "react";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { Link } from "@remix-run/react";
import { CATEGORIES } from "~/const";
import { IconHome } from "@tabler/icons";
import { Container } from "./common/container";
import { Menu } from "./Menu/Menu";

export const DefaultLayout: FC<{
  children?: React.ReactNode;
  currentUser?: TUserSession | null;
  navbar?: React.ReactNode | undefined;
  header?:
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | undefined;
  footer?:
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | undefined;
}> = ({ children, navbar }) => {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <Header />
          <div className="bg-base-200">
            <article style={{ minHeight: "100vh" }}>
              <Container classes={{ root: "bg-base-200" }}>
                {children}
              </Container>
            </article>
            <div style={{ height: 50 }} />
            <hr />
            <div>
              <Footer />
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="drawer" className="drawer-overlay"></label>
          <aside className="w-80">
            <div className="z-20 bg-opacity-90 backdrop-blur sticky top-0 items-center gap-2 px-4 py-2 hidden lg:flex shadow-sm">
              <Link to="/" className="btn btn-ghost normal-case text-xl">
                Cat Arks
              </Link>
              <p className="font-mono text-xs text-opacity-50">0.1.0</p>
            </div>
            <div className="mt-2"></div>
            <ul className="menu menu-compact flex flex-col p-0 px-4">
              <li>
                <Link to="/" className="flex gap-4   ">
                  <IconHome className="flex-none" />
                  <span className="flex-1">TOP</span>
                </Link>
              </li>
              <Menu sections={
                [{
                  title: "CATEGORIES", links: [...CATEGORIES.map((category) => {
                    return { title: category.title, link: `/categories/${category.value}` }
                  })], firstDivider: true
                }, {
                  title: "ITEMS", links: [{ title: 'ランキング', link: '/items/ranking' }]
                }, {
                  title: "UTILS", links: [{ title: "トレード価格計算機", link: "/utils/calc_item_price", label: 'New' }]
                }]
              } />
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
};
