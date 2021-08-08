export type PageContextBuiltInClient = Partial<PageContextBuiltIn> & {
  Page: any
  pageExports: Record<string, any>
  isHydration: boolean
}

export type PageContextBuiltIn = {
  Page: any
  pageExports: Record<string, any>
  routeParams: Record<string, string>
  url: string
  urlPathname: string
  urlNormalized: string
  urlParsed: {
    pathname: string
    search: null | Record<string, string>
    hash: null | string
  }
}
