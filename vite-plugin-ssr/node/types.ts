export type PageContextBuiltIn = {
  Page: any
  pageExports: Record<string, unknown>
  routeParams: Record<string, string>
  url: string
  urlPathname: string
  urlParsed: {
    pathname: string
    search: null | Record<string, string>
    hash: null | string
  }
}

export interface DefinePageContext<PageContext extends {}, U extends {}> {
  PageContext: PageContextBuiltIn & PageContext;
  OnBeforeHook: (arg: PageContextBuiltIn & PageContext) =>
    { pageContext?: { pageProps?: Record<string, unknown> } } & U;
}
