import type { FC } from "react";
import React from "react";
import { Footer } from "./Footer";
import { DefaultHeader } from "./header";
import { Link } from "@remix-run/react";
import { CATEGORIES } from "~/const";
import { IconHome } from "@tabler/icons";

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
      <div className="drawer drawer-mobile">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <DefaultHeader />
          <div className="mt-5">
            <article>
              <div className="bg-slate-50 rounded-lg p-2 shadow-md">
                {children}
              </div>
            </article>
            <div style={{ height: 50 }} />
            <div>
              <Footer />
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="drawer" className="drawer-overlay"></label>
          <aside className="bg-base-200 w-80">
            <div className="z-20 bg-base-200 bg-opacity-90 backdrop-blur sticky top-0 items-center gap-2 px-4 py-2 hidden lg:flex shadow-sm">
              <Link to="/" className="btn btn-ghost normal-case text-xl">
                Cat Arks
              </Link>
              <p className="font-mono text-xs text-opacity-50">
                0.1.0
              </p>
            </div>
            <div className="mt-2"></div>
            <ul className="menu menu-compact flex flex-col p-0 px-4">
              <li>
                <Link to="/" className="flex gap-4   ">
                  <IconHome className="flex-none" />
                  <span className="flex-1">TOP</span>
                </Link>
              </li>
            </ul>
            <ul className="menu menu-compact flex flex-col p-0 px-4">
              <li></li>
              <li>
                <span className="menu-title">CATEGORIES</span>
              </li>
              {CATEGORIES.map((category) => {
                return (
                  <li key={category.value}>
                    <Link to={`/categories/${category.value}`}>
                      {category.title}
                      {category.value === "material" && (
                        <span className="badge">New</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
};
