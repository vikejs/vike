import { expect, describe, it } from 'vitest'
import { getPagesAndRoutesInfo } from './log404'
import { stripAnsi } from '../utils'
import type { PageRoutes } from '../../../shared/route'

describe('getPagesAndRoutesInfo)', () => {
  it('table layout', () => {
    const table = getPagesAndRoutesInfo(pageRoutes)
    /*/
    console.log(table)
    /*/
    expect(stripAnsi(table)).toMatchInlineSnapshot(`
      "┌──────────────────────────────────────────────────────────────────────┬───────────────────┬────────────────────────────────────────────┐
      │ ROUTE                                                                │ TYPE              │ DEFINED BY                                 │
      ├──────────────────────────────────────────────────────────────────────┼───────────────────┼────────────────────────────────────────────┤
      │ /                                                                    │ Filesystem Route  │ /pages/index/                              │
      │ /markdown                                                            │ Filesystem Route  │ /pages/markdown/                           │
      │ /star-wars                                                           │ Filesystem Route  │ /pages/star-wars/index/                    │
      │ /star-wars/@id                                                       │ Filesystem Route  │ /pages/star-wars/@id/                      │
      │ function route(pageContext) { if (pageContext.urlPathname === \\"/...  │ Route Function    │ /pages/hello/+route.ts > \`export default\`  │
      └──────────────────────────────────────────────────────────────────────┴───────────────────┴────────────────────────────────────────────┘"
    `)
    //*/
  })
})

const pageRoutes = [
  {
    pageId: '/pages/hello',
    comesFromV1PageConfig: true,
    routeDefinedAt: '/pages/hello/+route.ts > `export default`',
    routeType: 'FUNCTION',
    routeFunction: function route(pageContext: { urlPathname: string }) {
      if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
        const name = 'anonymous'
        return { routeParams: { name } }
      }
      // ...
    }
  },
  {
    pageId: '/pages/index',
    routeFilesystemDefinedBy: '/pages/index/',
    comesFromV1PageConfig: true,
    routeString: '/',
    routeDefinedAt: null,
    routeType: 'FILESYSTEM'
  },
  {
    pageId: '/pages/markdown',
    routeFilesystemDefinedBy: '/pages/markdown/',
    comesFromV1PageConfig: true,
    routeString: '/markdown',
    routeDefinedAt: null,
    routeType: 'FILESYSTEM'
  },
  {
    pageId: '/pages/star-wars/@id',
    routeFilesystemDefinedBy: '/pages/star-wars/@id/',
    comesFromV1PageConfig: true,
    routeString: '/star-wars/@id',
    routeDefinedAt: null,
    routeType: 'FILESYSTEM'
  },
  {
    pageId: '/pages/star-wars/index',
    routeFilesystemDefinedBy: '/pages/star-wars/index/',
    comesFromV1PageConfig: true,
    routeString: '/star-wars',
    routeDefinedAt: null,
    routeType: 'FILESYSTEM'
  }
] satisfies PageRoutes
