import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration} from "@remix-run/react";
import { authenticator } from "./utils/auth.server.js";
import { useOptionalUser } from "./utils/utils.js";
import { Toaster } from "react-hot-toast";
import { cssBundleHref } from "@remix-run/css-bundle";
import styles from "./tailwind.css";
import { withSentry } from "@sentry/remix";


export const meta: V2_MetaFunction = () => {
  return [
    { charSet: "utf-8" },
    { title: "Cat Arks" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ]
};

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    // { rel: "stylesheet", href: contextStyle },
  ];
}

export async function loader({ request }: LoaderArgs) {
  let user = await authenticator.isAuthenticated(request);
  return json(user ? user : null);
}

function App() {
  const currentUser = useOptionalUser()
  // useHydrateAtoms([
  //   [useSessionState, undefined],
  //   [useModalState, { isOpenedPriceRepost: false }],
  // ]);
  // const setUser = useSetAtom(useSessionState);
  // const setModalState = useSetAtom(useModalState);
  // const currentUser = useTypedLoaderData<typeof loader>();
  // useKey(["n"], () => {
  //   if (currentUser) {
  //     setModalState({ isOpenedPriceRepost: true });
  //   }
  // });


  return (
    <html
      lang="ja"
    >
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {/* <ClientOnly>{() => <ReportPriceModal />}</ClientOnly> */}
        <Outlet />
        <Toaster />


        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
export default withSentry(App, {
  errorBoundaryOptions: {
    fallback: <p>An error has occurred</p>,
  },});


