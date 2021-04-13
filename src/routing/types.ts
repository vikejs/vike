export type PageId = string

export type FunctionalRouteMatch = {
  matchValue: boolean | number
  routeParams: Record<string, unknown>
}

export type PageRoute<T=string | Function | FunctionalRouteMatch> = {
  pageRouteFile?: string
  pageRoute: T
  id: PageId
}

export type FunctionalRoute = PageRoute<Function>;

export type CompiledFunctionalRoute = PageRoute<(FunctionalRouteMatch|string)>;

export type RouteMatch = { 
  routeParams: Record<string, unknown>, 
  pageId: PageId 
}