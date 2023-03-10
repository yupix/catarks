import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { startTransition, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import * as Sentry from "@sentry/remix";

Sentry.init({
  dsn: "https://60951744881346f9b81c6d5704004ce7@sentry.akarinext.org/3",
  tracesSampleRate: 1,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches,
      ),
    }),
  ],
})

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
        <RemixBrowser />
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  setTimeout(hydrate, 1);
}
