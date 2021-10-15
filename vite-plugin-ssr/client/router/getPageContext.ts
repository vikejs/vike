import { navigationState } from '../navigationState'
import {
  assert,
  assertUsage,
  assertWarning,
  getFileUrl,
  hasProp,
  isPlainObject,
  objectAssign,
  throwError
} from '../../shared/utils'
import { parse } from '@brillout/json-s'
import { getPageContextSerializedInHtml } from '../getPageContextSerializedInHtml'
import { findDefaultFile, findPageFile } from '../../shared/getPageFiles'
import type { PageContextUrls } from '../../shared/addComputedurlProps'
import { ServerFiles } from './getGlobalContext'
import { PageContextForRoute, route } from '../../shared/route'
import { PageIsomorphicFile, PageIsomorphicFileDefault } from '../../shared/loadPageIsomorphicFiles'
import { assertUsageServerHooksCalled, runOnBeforeRenderHooks } from '../../shared/onBeforeRenderHook'
import { loadPageFiles } from '../loadPageFiles'
import { releasePageContextInterim } from '../releasePageContext'
import { PageContextBuiltInClient } from '../../types'

type PageContextPublic = PageContextBuiltInClient

export { getPageContext }

async function getPageContext(
  pageContext: {
    url: string
    _serverFiles: ServerFiles
    _isFirstRender: boolean
  } & PageContextUrls &
    PageContextForRoute
): Promise<
  {
    _pageId: string
    _pageContextRetrievedFromServer: null | Record<string, unknown>
    isHydration: boolean
    _comesDirectlyFromServer: boolean
    Page: unknown
    pageExports: Record<string, unknown>
  } & Record<string, unknown>
> {
  if (pageContext._isFirstRender && navigationState.isOriginalUrl(pageContext.url)) {
    const pageContextAddendum = getPageContextSerializedInHtml()

    deleteRedundantPageContext(pageContextAddendum)

    const pageFiles = await loadPageFiles({ ...pageContext, ...pageContextAddendum })
    objectAssign(pageContextAddendum, pageFiles)

    objectAssign(pageContextAddendum, {
      isHydration: true,
      _comesDirectlyFromServer: true
    })

    return pageContextAddendum
  }

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
    isHydration: false
  }
  objectAssign(pageContextAddendum, routeResult.pageContextAddendum)

  const pageFiles = await loadPageFiles({ ...pageContext, ...pageContextAddendum })
  objectAssign(pageContextAddendum, pageFiles)

  if (getOnBeforeRenderServerHookFiles({ ...pageContext, ...pageContextAddendum }).length === 0) {
    objectAssign(pageContextAddendum, { _pageContextRetrievedFromServer: null, _comesDirectlyFromServer: false })
    return pageContextAddendum
  }

  const pageContextFromServer = await executeOnBeforeRenderHooks({ ...pageContext, ...pageContextAddendum })
  objectAssign(pageContextAddendum, pageContextFromServer)
  return pageContextAddendum

  function handle404() {
    // We let the server show the 404 page
    window.location.pathname = pageContext.url
  }
}

async function retrievePageContext(
  pageContext: {
    url: string
    _serverFiles: ServerFiles
  } & PageContextForRoute
): Promise<Record<string, unknown>> {
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
  const pageContextFromServer = responseObject.pageContext
  assert(isPlainObject(pageContextFromServer))
  assert(hasProp(pageContextFromServer, '_pageId', 'string'))

  deleteRedundantPageContext(pageContextFromServer)

  return pageContextFromServer
}

function getOnBeforeRenderServerHookFiles(pageContext: { _serverFiles: ServerFiles; _pageId: string }): string[] {
  const hooksServer: string[] = []
  const serverFiles = pageContext._serverFiles
  const pageId = pageContext._pageId
  const serverFileDefault = findDefaultFile(serverFiles, pageId)
  if (serverFileDefault?.fileExports.exportsOnBeforeRender) {
    hooksServer.push(serverFileDefault.filePath)
  }
  const serverFilePage = findPageFile(serverFiles, pageId)
  if (serverFilePage?.fileExports.exportsOnBeforeRender) {
    hooksServer.push(serverFilePage.filePath)
  }
  return hooksServer
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

async function executeOnBeforeRenderHooks(
  pageContext: {
    _pageId: string
    _pageIsomorphicFile: PageIsomorphicFile
    _pageIsomorphicFileDefault: PageIsomorphicFileDefault
    _serverFiles: ServerFiles
  } & PageContextForRoute &
    PageContextPublic
) {
  let serverHooksCalled: boolean = false
  let skipServerHooks: boolean = false

  const pageContextAddendum = {}
  objectAssign(pageContextAddendum, { _pageContextRetrievedFromServer: null })

  if (isomorphicHooksExist()) {
    const pageContextFromIsomorphic = await runOnBeforeRenderHooks(
      pageContext._pageIsomorphicFile,
      pageContext._pageIsomorphicFileDefault,
      {
        ...pageContext,
        skipOnBeforeRenderServerHooks,
        runOnBeforeRenderServerHooks: () => runOnBeforeRenderServerHooks(false)
      }
    )
    assertUsageServerHooksCalled({
      hooksServer: getOnBeforeRenderServerHookFiles(pageContext),
      hooksIsomorphic: [
        pageContext._pageIsomorphicFile?.onBeforeRenderHook && pageContext._pageIsomorphicFile.filePath,
        pageContext._pageIsomorphicFileDefault?.onBeforeRenderHook && pageContext._pageIsomorphicFileDefault.filePath
      ],
      serverHooksCalled,
      _pageId: pageContext._pageId
    })
    objectAssign(pageContextAddendum, pageContextFromIsomorphic)
    objectAssign(pageContextAddendum, { _comesDirectlyFromServer: false })
    return pageContextAddendum
  } else {
    const result = await runOnBeforeRenderServerHooks(true)
    assert(serverHooksCalled)
    objectAssign(pageContextAddendum, result.pageContext)
    objectAssign(pageContextAddendum, { _comesDirectlyFromServer: true })
    return pageContextAddendum
  }

  function isomorphicHooksExist() {
    return !!pageContext._pageIsomorphicFile?.onBeforeRenderHook || !!pageContext._pageIsomorphicFileDefault?.onBeforeRenderHook
  }

  async function skipOnBeforeRenderServerHooks() {
    assertUsage(
      serverHooksCalled === false,
      'You cannot call `pageContext.skipOnBeforeRenderServerHooks()` after having called `pageContext.runOnBeforeRenderServerHooks()`.'
    )
    skipServerHooks = true
  }

  async function runOnBeforeRenderServerHooks(doNotPrepareForRelease: boolean) {
    assertUsage(
      skipServerHooks === false,
      'You cannot call `pageContext.runOnBeforeRenderServerHooks()` after having called `pageContext.skipOnBeforeRenderServerHooks()`.'
    )
    assertUsage(
      serverHooksCalled === false,
      'You already called `pageContext.runOnBeforeRenderServerHooks()`; you cannot call it a second time.'
    )
    serverHooksCalled = true
    const pageContextFromServer = await retrievePageContext(pageContext)
    objectAssign(pageContextAddendum, { _pageContextRetrievedFromServer: pageContextFromServer })
    let pageContextReadyForRelease = !doNotPrepareForRelease
      ? releasePageContextInterim(pageContextFromServer, pageContextAddendum)
      : pageContextFromServer
    return { pageContext: pageContextReadyForRelease }
  }
}
