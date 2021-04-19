export type PageId = string

export type RouteFunctionMatch = {
  matchValue: boolean | number
  routeParams: Record<string, unknown>
}

export type PageRoute<T=string | Function | RouteFunctionMatch> = {
  pageRouteFile?: string
  pageRoute: T
  id: PageId
}

export type RouteFunction = PageRoute<Function>;

export type CompiledRouteFunction = PageRoute<(RouteFunctionMatch|string)>;

export type RouteMatch = { 
  routeParams: Record<string, unknown>, 
  pageId: PageId 
}