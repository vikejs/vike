import React from "react";
import { html } from "vite-plugin-ssr";
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import App from '../App'

export { render, addContextProps, setPageProps };

type Page = (pageProps: any) => JSX.Element;
type PageProps = any;
type ContextProps = {
  title?: string
  client: ApolloClient<NormalizedCacheObject>
  initialApolloState: NormalizedCacheObject
  pageHtml: string
};

function render({
  contextProps,
}: {
  contextProps: ContextProps;
}) {
  const title = contextProps.title || "Demo: vite-plugin-ssr";

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="page-content">${html.dangerouslySetHtml(contextProps.pageHtml)}</div>
      </body>
    </html>`;
}

async function addContextProps({
  Page,
  pageProps,
  contextProps
}: {
  Page: Page;
  pageProps: PageProps;
  contextProps: ContextProps;
}) {
  let pageHtml, initialApolloState;

  const tree = <App client={contextProps.client}>
    <Page {...pageProps} />
  </App>;

  await getDataFromTree(tree).then((_pageHtml) => {
    pageHtml = _pageHtml;
    initialApolloState = contextProps.client.extract();
  });

  return { pageHtml, initialApolloState };
}

function setPageProps({ contextProps }: {contextProps: ContextProps}) {
  return { initialApolloState: contextProps.initialApolloState };
}
