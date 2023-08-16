import { expect, describe, it } from 'vitest'
import { getPagesAndRoutesInfo } from '../log404/index.js'
import { stripAnsi } from '../../utils.js'
import type { PageRoutes } from '../../../../shared/route/index.js'

describe('getPagesAndRoutesInfo()', () => {
  it('table layout - basic', () => {
    const table = getPagesAndRoutesInfo(pageRoutes1)
    /*/
    console.log(table)
    /*/
    expect(stripAnsi(table)).toMatchFileSnapshot('./index.spec.snapshot-1')
    //*/
  })
  it('table layout - with Route Function', () => {
    const table = getPagesAndRoutesInfo(pageRoutes2)
    /*/
    console.log(table)
    /*/
    expect(stripAnsi(table)).toMatchFileSnapshot('./index.spec.snapshot-2')
    //*/
  })
})

const routeFunction = {
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
} as const
const pageRoutes1 = [
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
const pageRoutes2 = [routeFunction, ...pageRoutes1] satisfies PageRoutes
