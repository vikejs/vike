export type PageContextBuiltIn = {
  Page: any
  pageExports: Record<string, unknown>
  routeParams: Record<string, string>
  exports: Record<string, unknown>
  url: string
  urlPathname: string
  urlParsed: {
    pathname: string
    search: null | Record<string, string>
    hash: null | string
  }
}
