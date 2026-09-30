import { expect, describe, it } from 'vitest'
import { createHttpResponsePageJson, createHttpResponseRedirect } from './createHttpResponse.js'
import { resolveHeadersResponseFinal } from './headersResponse.js'
import type { PageContextAborted } from '../../../shared-server-client/route/abort.js'
import type { PageContextBegin } from '../renderPageServer.js'

const getHeadersResponse = (...setCookie: string[]) => {
  const headersResponse = new Headers({
    'Cache-Control': 'public, max-age=3600',
    'Content-Security-Policy': "script-src 'self'",
    'X-Powered-By': 'my-vike-app',
  })
  setCookie.forEach((value) => headersResponse.append('Set-Cookie', value))
  return headersResponse
}
const getPageContextAborted = (...setCookie: string[]) =>
  ({ headersResponse: getHeadersResponse(...setCookie) }) as unknown as PageContextAborted

describe('pageContext.headersResponse', () => {
  it('pageContext.json response: Set-Cookie only', async () => {
    const httpResponse = await createHttpResponsePageJson('{}', {
      headersResponse: getHeadersResponse('a=1; Path=/', 'b=2; Path=/'),
      pageContextsAborted: [],
    })
    expect(httpResponse.headers).toEqual([
      ['set-cookie', 'a=1; Path=/'],
      ['set-cookie', 'b=2; Path=/'],
      ['Content-Type', 'application/json'],
    ])
  })

  it('pageContext.json response: Set-Cookie before throw redirect()', async () => {
    const httpResponse = await createHttpResponsePageJson('{}', {
      pageContextsAborted: [getPageContextAborted('a=1; Path=/')],
    })
    expect(httpResponse.headers).toEqual([
      ['set-cookie', 'a=1; Path=/'],
      ['Content-Type', 'application/json'],
    ])
  })

  it('HTML redirect: Set-Cookie before throw redirect()', () => {
    const pageContextBegin = {
      urlOriginal: '/admin',
      pageContextsAborted: [getPageContextAborted('a=1; Path=/')],
    } as unknown as PageContextBegin
    const httpResponse = createHttpResponseRedirect({ url: '/login', statusCode: 302 }, pageContextBegin)
    expect(httpResponse.statusCode).toBe(302)
    expect(httpResponse.headers).toEqual([
      ['Location', '/login'],
      ['set-cookie', 'a=1; Path=/'],
      ['Content-Type', 'text/html;charset=utf-8'],
    ])
  })

  it('HTML page: Set-Cookie before throw render()', () => {
    const headers = resolveHeadersResponseFinal(
      {
        headersResponse: getHeadersResponse('session=old; Path=/'),
        pageContextsAborted: [
          getPageContextAborted('session=old; Path=/'),
          getPageContextAborted('session=new; Path=/'),
        ],
      },
      401,
    )
    // In order: the cookie value set last wins
    expect(headers).toEqual([
      ['set-cookie', 'session=old; Path=/'],
      ['set-cookie', 'session=new; Path=/'],
      ['cache-control', 'public, max-age=3600'],
      ['content-security-policy', "script-src 'self'"],
      ['set-cookie', 'session=old; Path=/'],
      ['x-powered-by', 'my-vike-app'],
    ])
  })
})
