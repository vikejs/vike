import { navigationState } from '../navigationState'
import { assert, assertWarning, getFileUrl, hasProp, isPlainObject, objectAssign, throwError } from '../../shared/utils'
import { parse } from '@brillout/json-s'
import { getPageContextSerializedInHtml } from '../getPageContextSerializedInHtml'
import { findDefaultFile, findPageFile } from '../../shared/getPageFiles'
import { ServerFiles } from './getGlobalContext'
import { PageContextForRoute, route } from '../../shared/route'

export { getPageContext }

async function getPageContext(
  pageContext: {
    url: string
    _serverFiles: ServerFiles
  } & PageContextForRoute
): Promise<
  {
    _pageId: string
    _pageContextRetrievedFromServer: null | Record<string, unknown>
    _pageContextComesFromHtml: boolean
  } & Record<string, unknown>
> {
  if (navigationState.isOriginalUrl(pageContext.url)) {
    const pageContextAddendum = getPageContextSerializedInHtml()
    deleteRedundantPageContext(pageContextAddendum)
    return pageContextAddendum
  } else {
    const pageContextAddendum = await retrievePageContext(pageContext)
    return pageContextAddendum
  }
}

async function retrievePageContext(
  pageContext: {
    url: string
    _serverFiles: ServerFiles
  } & PageContextForRoute
) {
  const routeResult = await route(pageContext)
  if ('hookError' in routeResult) {
    throw routeResult.hookError
  }
  if (routeResult.pageContextAddendum._pageId === null) {
    handle404()
    assert(false)
  }
  assert(hasProp(routeResult.pageContextAddendum, '_pageId', 'string'))

  const pageContextAddendum = {
    _pageContextComesFromHtml: false
  }
  objectAssign(pageContextAddendum, routeResult.pageContextAddendum)

  if (!hasServerSideOnBeforeRenderHook({ ...pageContext, ...pageContextAddendum })) {
    objectAssign(pageContextAddendum, { _pageContextRetrievedFromServer: null })
    return pageContextAddendum
  }

  const response = await fetch(getFileUrl(pageContext.url, '.pageContext.json', true))

  // Static hosts return a 404
  assert(response.status !== 404)

  const responseText = await response.text()
  const responseObject = parse(responseText) as { pageContext: Record<string, unknown> } | { serverSideError: true }
  assert(!('pageContext404PageDoesNotExist' in responseObject))
  if ('serverSideError' in responseObject) {
    throwError(`An error occurred on the server. Check your server logs.`)
  }

  assert(hasProp(responseObject, 'pageContext'))
  const pageContextRetrievedFromServer = responseObject.pageContext
  assert(isPlainObject(pageContextRetrievedFromServer))
  assert(hasProp(pageContextRetrievedFromServer, '_pageId', 'string'))
  objectAssign(pageContextAddendum, { _pageContextRetrievedFromServer: pageContextRetrievedFromServer })
  objectAssign(pageContextAddendum, pageContextRetrievedFromServer)

  deleteRedundantPageContext(pageContextAddendum)

  return pageContextAddendum

  function handle404() {
    // We let the server show the 404 page
    window.location.pathname = pageContext.url
  }
}

function hasServerSideOnBeforeRenderHook(pageContext: { _serverFiles: ServerFiles; _pageId: string }): boolean {
  const serverFiles = pageContext._serverFiles
  const pageId = pageContext._pageId
  const serverFileDefault = findDefaultFile(serverFiles, pageId)
  if (serverFileDefault?.fileExports.exportsOnBeforeRender) {
    return true
  }
  const serverFilePage = findPageFile(serverFiles, pageId)
  if (serverFilePage?.fileExports.exportsOnBeforeRender) {
    return true
  }
  return false
}

const ALREADY_SET_BY_CLIENT_ROUTER = ['urlNormalized', 'urlPathname', 'urlParsed'] as const
const ALREADY_SET_BY_CLIENT = ['Page', 'pageExports'] as const
type DeletedKeys = typeof ALREADY_SET_BY_CLIENT[number] | typeof ALREADY_SET_BY_CLIENT_ROUTER[number]
function deleteRedundantPageContext(pageContext: Record<string, unknown> & { [key in DeletedKeys]?: never }) {
  const alreadySet = [...ALREADY_SET_BY_CLIENT, ...ALREADY_SET_BY_CLIENT_ROUTER]
  alreadySet.forEach((prop) => {
    if (prop in pageContext) {
      // We need to cast `ALREADY_SET_BY_CLIENT` to `string[]`
      //  - https://stackoverflow.com/questions/56565528/typescript-const-assertions-how-to-use-array-prototype-includes
      //  - https://stackoverflow.com/questions/57646355/check-if-string-is-included-in-readonlyarray-in-typescript
      if ((ALREADY_SET_BY_CLIENT_ROUTER as any as string[]).includes(prop)) {
        assert(prop.startsWith('url'))
        assertWarning(
          false,
          `\`pageContext.${prop}\` is already available in the browser when using \`useClientRouter()\`; including \`${prop}\` in \`passToClient\` has no effect.`
        )
      } else {
        assertWarning(
          false,
          `\`pageContext.${prop}\` is a built-in that cannot be overriden; including \`${prop}\` in \`passToClient\` has no effect.`
        )
      }
      delete pageContext[prop]
    }
  })
}
