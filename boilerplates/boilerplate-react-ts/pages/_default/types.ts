export type ReactComponent = (pageProps: PageProps) => JSX.Element;
export type PageProps = {};
export type PageContext = {
  Page: ReactComponent;
  pageProps: PageProps;
  documentProps?: {
    title?: string;
    description?: string;
  };
};
