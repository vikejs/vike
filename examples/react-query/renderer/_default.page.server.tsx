export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [
  "pageProps",
  "urlPathname",
  "documentProps",
  "someAsyncProps",
  "dehydratedState",
];

import ReactDOMServer from "react-dom/server";
import React from "react";
import {
  dehydrate,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import logoUrl from "./logo.svg";
import type { PageContextServer, QueryPrefetch } from "./types";

async function render(pageContext: PageContextServer) {
  const pageCtx = pageContext;

  const {
    Page,
    pageProps,
    exports: { prefetchQueries },
    urlPathname,
  } = pageCtx;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 0, // cacheTime value need to be 0 here if you want to use prerendering
        staleTime: Infinity,
        retryDelay: 2000,
      },
    },
  });

  if (prefetchQueries?.constructor === Object) {
    const queries: Promise<void>[] = [];
    Object.entries(prefetchQueries).forEach(([key, query]: QueryPrefetch) => {
      queries.push(queryClient.prefetchQuery([key], query.fn));
    });

    await Promise.all(queries);
  }
  const dehydratedState = dehydrate(queryClient);
  pageCtx.dehydratedState = dehydratedState;

  // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
  if (!Page)
    throw new Error("My render() hook expects pageContext.Page to be defined");

  const pageHtml = ReactDOMServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <PageShell pageContext={pageContext}>
          <Page {...pageProps} />
        </PageShell>
      </Hydrate>
    </QueryClientProvider>
  );

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageCtx.exports;
  const title = documentProps?.title ?? "No title in server";
  const desc = documentProps?.description ?? "App using Vite + vite-plugin-ssr";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
