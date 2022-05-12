import { pickWinner } from './pickWinner'
import { resolveRouteString } from './resolveRouteString'
import { expect, describe, it } from 'vitest'

describe('precedence', () => {
  it('route precedence - basic', () => {
    const routes = ['/', '/about', '/about/team', '/about/:path', '/about/*']

    ;[
      ['/', '/'],
      ['/about', '/about'],
      ['/about/team', '/about/team'],
      ['/about/company', '/about/:path'],
      ['/about/some/nested/path', '/about/*'],
    ].forEach(([url, routeString]) => testUrl(url!, routeString!, routes))
  })

  it('route precedence - catch-all', () => {
    const routes = ['/', '/*', '/hello/:name']

    ;[
      ['/', '/'],
      ['/hello', '/*'],
      ['/hello/jon', '/hello/:name'],
      ['/hello/jon/snow', '/*'],
    ].forEach(([url, routeString]) => testUrl(url!, routeString!, routes))
  })

  it('route precedence - advanced', () => {
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
      '/product/*',
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
      ['/product/42/review', '/product/:productId/review'],
      ['/product/42/review/too-long', '/product/*'],
    ].forEach(([url, routeString]) => testUrl(url!, routeString!, routes))
  })

  it('route precedence - newspaper use case', () => {
    const routes = [
      '/', // homepage
      '/*', // catch all generic pages at multiple levels
      '/news', // news landing page
      '/news/:page', // news paginated news results
      '/news/:year/:slug', // news articles
      '/news/press-releases/*', // press releases landing and paginated news pages (nested in /news)
      '/news/press-releases/:year/:slug', // press releases (nested in /news)
    ]

    ;[
      ['/', '/'],
      ['/news', '/news'],
      ['/news/1', '/news/:page'],
      ['/news/2021/breaking-news', '/news/:year/:slug'],
      ['/news/press-releases', '/news/press-releases/*'],
      ['/news/press-releases/1', '/news/press-releases/*'],
      ['/news/press-releases/2021/new-funding', '/news/press-releases/:year/:slug'],
      ['/other', '/*'],
    ].forEach(([url, routeString]) => testUrl(url!, routeString!, routes))
  })

  function testUrl(url: string, routeString: string, routes: string[]) {
    const route = findRoute(url, routes)
    expect(`${url} -> ${route}`).toBe(`${url} -> ${routeString}`)
  }

  function findRoute(url: string, routes: string[]): string | null {
    const candidates = routes
      .map((routeString) => {
        const result = resolveRouteString(routeString, url)
        if (result === null) {
          return null
        }
        return { ...result, routeString, routeType: 'STRING' as const }
      })
      .filter(<T>(match: T | null): match is T => match !== null)
    return pickWinner(candidates)?.routeString || null
  }
})
