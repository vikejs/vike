import type { PageContextBuiltIn } from "vite-plugin-ssr/types";
export type Component = (pageProps: any) => JSX.Element;
export type Children = React.ReactNode | React.ReactNode[];
export type PageContext = PageContextBuiltIn & {
  Page: Component;
  pageExports: {
    documentProps?: {
      title: string;
    };
  };
  pageProps: Record<string, unknown>;
  documentProps?: {
    title: string;
  };
};
