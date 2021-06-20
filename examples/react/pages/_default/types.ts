export type Component = (pageProps: any) => JSX.Element;
export type PageContext = {
  Page: Component;
  pageProps: Record<string, unknown>;
  pageExports: {
    documentProps?: {
      title: string;
    };
  };
  documentProps?: {
    title: string;
  };
  routeParams: Record<string, unknown>;
  isHydration: boolean;
};
