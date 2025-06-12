import { expect, describe, it, assert } from 'vitest'
import { getRoutesInfo } from '../log404/index.js'
import { stripAnsi } from '../../utils.js'
import type { PageRoutes } from '../../../../shared/route/index.js'

process.stdout.columns = 134

describe('getRoutesInfo()', () => {
  it('table layout - basic', async () => {
    const table = getRoutesInfo(pageRoutes1)
    assert(table)
    /*/
    console.log(table)
    /*/
    await expect(stripAnsi(table)).toMatchFileSnapshot('./index.spec.snapshot-1')
    //*/
  })
  it('table layout - with Route Function', async () => {
    const table = getRoutesInfo(pageRoutes2)
    assert(table)
    /*/
    console.log(table)
    /*/
    await expect(stripAnsi(table)).toMatchFileSnapshot('./index.spec.snapshot-2')
    //*/
  })
})

const routeFunction = {
  pageId: '/pages/hello',
  comesFromV1PageConfig: true,
  routeDefinedAtString: '/pages/hello/+route.ts > export default',
  routeType: 'FUNCTION',
  routeFunction: function route(pageContext: { urlPathname: string }) {
    if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
      const name = 'anonymous'
      return { routeParams: { name } }
    }
    // ...
  },
} as const
const pageRoutes1 = [
  {
    pageId: '/pages/index',
    routeFilesystemDefinedBy: '/pages/index/',
    comesFromV1PageConfig: true,
    routeString: '/',
    routeDefinedAtString: null,
    routeType: 'FILESYSTEM',
  },
  {
    pageId: '/pages/markdown',
    routeFilesystemDefinedBy: '/pages/markdown/',
    comesFromV1PageConfig: true,
    routeString: '/markdown',
    routeDefinedAtString: null,
    routeType: 'FILESYSTEM',
  },
  {
    pageId: '/pages/star-wars/@id',
    routeFilesystemDefinedBy: '/pages/star-wars/@id/',
    comesFromV1PageConfig: true,
    routeString: '/star-wars/@id',
    routeDefinedAtString: null,
    routeType: 'FILESYSTEM',
  },
  {
    pageId: '/pages/star-wars/index',
    routeFilesystemDefinedBy: '/pages/star-wars/index/',
    comesFromV1PageConfig: true,
    routeString: '/star-wars',
    routeDefinedAtString: null,
    routeType: 'FILESYSTEM',
  },
] satisfies PageRoutes
const pageRoutes2 = [routeFunction, ...pageRoutes1] satisfies PageRoutes
