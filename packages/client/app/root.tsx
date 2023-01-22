import type { ColorScheme } from "@mantine/core";
import { Loader } from "@mantine/core";
import { ColorSchemeProvider, createEmotionCache, MantineProvider } from "@mantine/core";
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
import { useSessionState } from "./states/common";
import ProgressBar from "./components/ProgressBar";
import { ReportPriceModal } from "./components/modals/reportPrice";
import { NotificationsProvider } from '@mantine/notifications';
import { authenticator } from "./utils/auth.server";


export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Cat Arks",
  viewport: "width=device-width,initial-scale=1",
});



export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request);
  return json(user ? user : null);

}

createEmotionCache({ key: 'mantine' });


export default function App() {
  const currentUser = useLoaderData<typeof loader>();
  useSessionState.user = currentUser
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const transition = useTransition();
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  }

  useEffect(() => {
    const warningMessage = () => {
      console.log('%cSTOP\n', 'color:red;font-size:8em')
      console.log('%cここに何かを貼り付けろといわれているならそれは%c11/10%cあなたに損をもたらします。何をしているか理解している場合は一緒にこのプロジェクトを盛り上げませんか?\n%cGitLab:  https://discord.gg/CcT997U', 'color: blue;font-size:2em;', 'color:black;font-size:4em;', 'color: blue;font-size:2em;', 'color:orange;font-size:2em;')
    }
    warningMessage()
  }, [])
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>

          <html lang="ja">
            <head>
              <StylesPlaceholder />
              <Meta />
              <Links />
            </head>
            <body>
              <ReportPriceModal />
              <Outlet />
              {transition.state === 'submitting' && <div style={{ position: "fixed", display: "flex", zIndex: 300, top: 14, right: 20 }}>
                <Loader />
              </div>}
              {transition.state === 'loading' && <ProgressBar />}
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
