import { pickWinner } from './pickWinner'
import { resolveRouteString } from './resolveRouteString'

test('route prioritization - basic', () => {
  const routes = [
    '/',
    '/about',
    '/about/team',
    '/*',
    '/:path',
    '/:path/:subpath',
    '/product/:productId',
    '/news/:year/:slug'
  ]

  ;[
    ['/', '/'],
    ['/about', '/about'],
    ['/about/team', '/about/team'],
    ['/hello', '/:path'],
    ['/hello/jon', '/:path/:subpath'],
    ['/hello/jon/snow', '/*'],
    ['/product/42', '/product/:productId'],
    ['/news/2021/introducing-ssr', '/news/:year/:slug']
  ].forEach(([url, routeExpected]) => {
    const route = findRoute(url, routes)
    expect(route).toBe(routeExpected)
  })
})

test('route prioritization - advanced', () => {
  const routes = [
    '/',
    '/about',
    '/about/team',
    '/*',
    '/:path',
    '/:path/:subpath',
    '/:path/:subpath/*',
    '/:path/*',
    '/product/:productId',
    '/product/:productId/review',
    '/product/:productId/:view',
    '/product/*'
  ]

  ;[
    ['/', '/'],
    ['/about', '/about'],
    ['/about/team', '/about/team'],
    ['/hello', '/:path'],
    ['/hello/jon', '/:path/:subpath'],
    ['/hello/jon/snow', '/:path/:subpath/*'],
    ['/product/42', '/product/:productId'],
    ['/product/42/details', '/product/:productId/:view'],
    // TODO; this is wrong
    ['/product/42/review/nested', '/:path/:subpath/*']
    /*
    ['/product/42/review/nested', '/product/*']
    */
  ].forEach(([url, routeExpected]) => {
    const route = findRoute(url, routes)
    expect(route).toBe(routeExpected)
  })
})

function findRoute(url: string, routes: string[]): string | null {
  const candidates = routes.map((route) => {
    const { matchValue } = resolveRouteString(route, url)
    return { matchValue, route }
  })
  return pickWinner(candidates)?.route || null
}
