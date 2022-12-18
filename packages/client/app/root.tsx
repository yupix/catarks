
import type { ColorScheme } from "@mantine/core";
import { ColorSchemeProvider, createEmotionCache, MantineProvider } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import styles from "./assets/main.css";


export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

createEmotionCache({ key: 'mantine' });


export default function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  }

  useEffect(() => {
    const warningMessage = () => {
      console.log('%cSTOP\n', 'color:red;font-size:8em')
      console.log('%cここに何かを貼り付けろといわれているならそれは%c11/10%cあなたに損をもたらします。何をしているか理解している場合は一緒にこのプロジェクトを盛り上げませんか?\n%cGitLab: https://lab.teamblackcrystal.com/yupix/vent', 'color: blue;font-size:2em;', 'color:black;font-size:4em;', 'color: blue;font-size:2em;', 'color:orange;font-size:2em;')
    }
    warningMessage()
  }, [])
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <html lang="ja">
          <head>
            <StylesPlaceholder />
            <Meta />
            <Links />
          </head>
          <body>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
