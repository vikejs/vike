export { render };

import React from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import {
  dehydrate,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PageShell } from "./PageShell";
import type { PageContextClient, QueryPrefetch } from "./types";

let root: Root | null = null;
let dehydratedState: unknown;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 10,
      staleTime: 30 * 1000,
      retryDelay: 2000,
    },
  },
});
// This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;

  if (!dehydratedState && pageContext.dehydratedState) {
    dehydratedState = pageContext.dehydratedState;
  }

  if (!Page)
    throw new Error(
      "Client-side render() hook expects pageContext.Page to be defined"
    );
  const page = (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <PageShell pageContext={pageContext}>
          <Page {...pageProps} />
        </PageShell>
      </Hydrate>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );

  const container = document.getElementById("page-view");

  if (!container) {
    throw new Error("No #page-view element found");
  }

  if (pageContext.isHydration) {
    root = hydrateRoot(container, page);
  } else {
    if (!root) {
      root = createRoot(container);
    }
    root.render(page);
  }
}

export async function onBeforeRender(pageContext: PageContextClient) {
  const { prefetchQueries } = pageContext.exports;

  if (prefetchQueries?.constructor === Object) {
    const queries: Promise<void>[] = [];
    Object.entries(prefetchQueries).forEach(([key, query]: QueryPrefetch) => {
      queries.push(queryClient.prefetchQuery([key], query.fn));
    });

    await Promise.all(queries);

    dehydratedState = dehydrate(queryClient);
  }
}

export const hydrationCanBeAborted = true;

/* To enable Client-side Routing:*/
export const clientRouting = true;
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
