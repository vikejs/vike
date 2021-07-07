import type { PageContextBuiltIn } from "vite-plugin-ssr/types";
export type ReactComponent = (pageProps: PageProps) => JSX.Element;
export type PageProps = {};
export type PageContext = PageContextBuiltIn & {
  Page: ReactComponent;
  pageProps: PageProps;
  documentProps?: {
    title?: string;
    description?: string;
  };
};
