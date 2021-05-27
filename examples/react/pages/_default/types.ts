export type Component = (pageProps: any) => JSX.Element;
export type PageContext = {
  Page: Component;
  pageProps: Record<string, unknown>;
  documentProps: {
    title: string;
  };
  routeParams: Record<string, unknown>;
  isHydration: boolean;
} & Record<string, any>;
