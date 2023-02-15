import type { ReactNode } from "react";
import { StrictMode, useCallback, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";
import { CacheProvider } from "@emotion/react";

import createEmotionCache from "./styles/createEmotionCache";
import ClientStyleContext from "./styles/client.context";

interface ClientCacheProviderProps {
  children: ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  const reset = useCallback(() => {
    setCache(createEmotionCache());
  }, []);

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

hydrateRoot(
  document,
  <StrictMode>
    <ClientCacheProvider>
      <RemixBrowser />
    </ClientCacheProvider>
  </StrictMode>
);
