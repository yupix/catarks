import type { FC } from "react";
import React from "react";
import { Footer } from "./Footer";
import { DefaultHeader } from "./header";

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
      <DefaultHeader />
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-5">
        <aside className="hidden sm:block">{navbar}</aside>
        <article className="col-span-4">
          <div className="bg-slate-50 rounded-lg p-2 shadow-md">{children}</div>
        </article>
        <div style={{ height: 400 }} />
        <div className="col-span-4">
          <Footer />
        </div>
      </div>
    </>
  );
};
