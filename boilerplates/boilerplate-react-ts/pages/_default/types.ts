import type { PageContextBuiltIn } from "vite-plugin-ssr/types";
export type PageProps = {};
export type PageContext = PageContextBuiltIn & {
  Page: (pageProps: PageProps) => JSX.Element;
  pageProps: PageProps;
  documentProps?: {
    title?: string;
    description?: string;
  };
};
