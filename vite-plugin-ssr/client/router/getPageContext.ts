import { navigationState } from '../navigationState'
import { assert, getFileUrl, hasProp, isPlainObject, objectAssign, throwError } from '../../shared/utils'
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
): Promise<{ _pageId: string } & Record<string, unknown>> {
  if (navigationState.isOriginalUrl(pageContext.url)) {
    const pageContextAddendum = getPageContextSerializedInHtml()
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
): Promise<{ _pageId: string } & Record<string, unknown>> {
  const routeResult = await route(pageContext)
  if ('hookError' in routeResult) {
    throw routeResult.hookError
  }
  objectAssign(pageContext, routeResult.pageContextAddendum)
  assert(pageContext._pageId !== null)
  assert(hasProp(pageContext, '_pageId', 'string'))

  if (!hasServerSideOnBeforeRenderHook(pageContext)) {
    return pageContext
  }

  const response = await fetch(getFileUrl(pageContext.url, '.pageContext.json', true))

  // Static hosts will return a 404
  if (response.status === 404) {
    fallbackToServerSideRouting()
  }

  const responseText = await response.text()
  const responseObject = parse(responseText) as { pageContext: Record<string, unknown> } | { serverSideError: true }
  if ('pageContext404PageDoesNotExist' in responseObject) {
    fallbackToServerSideRouting()
  }
  if ('serverSideError' in responseObject) {
    throwError(`An error occurred on the server. Check your server logs.`)
  }

  assert(hasProp(responseObject, 'pageContext'))
  const pageContextAddendum = responseObject.pageContext
  assert(isPlainObject(pageContextAddendum))
  assert(hasProp(pageContextAddendum, '_pageId', 'string'))

  return pageContextAddendum

  function fallbackToServerSideRouting() {
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
