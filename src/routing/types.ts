export type PageId = string

export type FunctionalRouteMatch = {
  matchValue: boolean | number
  routeParams: Record<string, unknown>
}

export type PageRoute = {
  pageRouteFile?: string
  pageRoute: string | Function | FunctionalRouteMatch
  id: PageId
}

export type RouteMatch = { 
  routeParams: Record<string, unknown>, 
  pageId: PageId 
}