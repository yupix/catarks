import type {
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useEffect } from "react";
import styles from "./assets/main.css";
import { useModalState, useSessionState } from "./states/common";
import { ReportPriceModal } from "./components/modals/reportPrice";
import { authenticator } from "./utils/auth.server";
import { assertIsDefined } from "./utils/utils";
import CSS from "./assets/css/tailwind.css";
import { ClientOnly } from "remix-utils";
import { Toaster } from "react-hot-toast";
import { useKey } from "rooks";
import { NotFoundError } from "./components/errors/notfoundError";
import { prisma } from "./utils/prisma.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Cat Arks",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: CSS },
  ];
}

export async function loader({ request }: LoaderArgs) {
  let user = await authenticator.isAuthenticated(request);

  return json(user ? user : null);
}

export default function App() {
  const currentUser = useLoaderData<typeof loader>();  
  if (currentUser) {
    assertIsDefined(currentUser);
    useSessionState.user = currentUser; // TODO: createdAtをDateに変える
  }
  const transition = useTransition();
  useKey(["n"], () => {
    if (currentUser) {
      useModalState.isOpenedPriceRepost = true;
    }
  });

  useEffect(() => {
    const warningMessage = () => {
      console.log("%cSTOP\n", "color:red;font-size:8em");
      console.log(
        "%cここに何かを貼り付けろといわれているならそれは%c11/10%cあなたに損をもたらします。何をしているか理解している場合は一緒にこのプロジェクトを盛り上げませんか?\n%cDiscord:  https://discord.gg/CcT997U",
        "color: blue;font-size:2em;",
        "color:black;font-size:4em;",
        "color: blue;font-size:2em;",
        "color:orange;font-size:2em;"
      );
    };
    warningMessage();
  }, []);
  return (
    <html lang="ja" data-theme={`${currentUser?.settings?.useTheme ? currentUser.settings.useTheme : "winter"}`}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ClientOnly>{() => <ReportPriceModal />}</ClientOnly>
        <Outlet />
        <Toaster />
        {transition.state === "submitting" && (
          <div
            style={{
              position: "fixed",
              display: "flex",
              zIndex: 300,
              top: 14,
              right: 20,
            }}
          >
            {/* <Loader /> */}
          </div>
        )}
        {/* {transition.state === "loading" && <ProgressBar />} */}

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {caught.status === 404 && <NotFoundError />}
          {/* {caught.status} {caught.statusText} */}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}
