import type { FC } from "react";
import React from "react";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { Link } from "@remix-run/react";
import { CATEGORIES, TUserSession } from "~/const";
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
      <Header />

      <div className="bg-base-200">
        <article style={{ minHeight: "100vh" }}>
          <Container classes={{ root: "bg-base-200" }}>
            {children}
          </Container>
        </article>
        <div className="border-b mb-4" />
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
};
