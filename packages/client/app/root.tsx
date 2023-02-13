import type { ColorScheme } from "@mantine/core";
import { Loader } from "@mantine/core";
import {
  ColorSchemeProvider,
  createEmotionCache,
  MantineProvider,
} from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import styles from "./assets/main.css";
import { useSessionState, useUserDevice } from "./states/common";
import ProgressBar from "./components/ProgressBar";
import { ReportPriceModal } from "./components/modals/reportPrice";
import { NotificationsProvider } from "@mantine/notifications";
import { authenticator } from "./utils/auth.server";
import { useSnapshot } from "valtio";
import { assertIsDefined } from "./utils/utils";
import CSS from "./css/app.css";
import { ClientOnly } from "remix-utils";
import { Toaster } from "react-hot-toast";

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
  const user = await authenticator.isAuthenticated(request);
  return json(user ? user : null);
}

createEmotionCache({ key: "mantine" });

export default function App() {
  const currentUser = useLoaderData<typeof loader>();
  useUserDevice.useTheme =
    currentUser?.settings?.useDarkTheme || false ? "dark" : "light";
  const device = useSnapshot(useUserDevice);
  if (currentUser) {
    assertIsDefined(currentUser);
    useSessionState.user = currentUser;
  }
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const transition = useTransition();
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (device.useTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const warningMessage = () => {
      console.log("%cSTOP\n", "color:red;font-size:8em");
      console.log(
        "%cここに何かを貼り付けろといわれているならそれは%c11/10%cあなたに損をもたらします。何をしているか理解している場合は一緒にこのプロジェクトを盛り上げませんか?\n%cGitLab:  https://discord.gg/CcT997U",
        "color: blue;font-size:2em;",
        "color:black;font-size:4em;",
        "color: blue;font-size:2em;",
        "color:orange;font-size:2em;"
      );
    };
    warningMessage();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NotificationsProvider>
          <html lang="ja" data-theme="winter">
            <head>
              <StylesPlaceholder />
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
                  <Loader />
                </div>
              )}
              {transition.state === "loading" && <ProgressBar />}
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </body>
          </html>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
