import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useNavigation
} from "@remix-run/react";
import { useEffect } from "react";
import { useModalState, useSessionState } from "./states/common.js";
import { ReportPriceModal } from "./components/modals/reportPrice.js";
import { authenticator } from "./utils/auth.server.js";
import { assertIsDefined } from "./utils/utils.js";
import CSS from "./assets/css/tailwind.css";
import { ClientOnly } from "remix-utils";
import { Toaster } from "react-hot-toast";
import { useKey } from "rooks";
import { NotFoundError } from "./components/errors/notfoundError.js";
import { useHydrateAtoms } from "jotai/utils";
import { useSetAtom } from "jotai";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import contextStyle from "react-contexify/ReactContexify.css";
import baseStyle from "./assets/css/base.css";
import { cssBundleHref } from "@remix-run/css-bundle";
import styles from "./tailwind.css";


export const meta: V2_MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "Cat Arks" },
    { viewport: "width=device-width,initial-scale=1" }]
};

export function links() {
  return [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: CSS },
    { rel: "stylesheet", href: contextStyle },
    { rel: "stylesheet", href: baseStyle },
  ];
}

export async function loader({ request }: LoaderArgs) {
  let user = await authenticator.isAuthenticated(request);
  return typedjson(user ? user : null);
}

export default function App() {
  useHydrateAtoms([
    [useSessionState, undefined],
    [useModalState, { isOpenedPriceRepost: false }],
  ]);
  const setUser = useSetAtom(useSessionState);
  const setModalState = useSetAtom(useModalState);
  const currentUser = useTypedLoaderData<typeof loader>();
  const navigation = useNavigation();
  useKey(["n"], () => {
    if (currentUser) {
      setModalState({ isOpenedPriceRepost: true });
    }
  });

  useEffect(() => {
    if (currentUser) {
      assertIsDefined(currentUser);
      setUser({ user: currentUser }); // TODO: createdAtをDateに変える
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  return (
    <html
      lang="ja"
      data-theme={`${currentUser?.settings?.useTheme
          ? currentUser.settings.useTheme
          : "winter"
        }`}
    >
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ClientOnly>{() => <ReportPriceModal />}</ClientOnly>
        <Outlet />
        <Toaster />

        {navigation.state === "submitting" && (
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
