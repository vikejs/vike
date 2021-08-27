import { checkType, getUrlPathname, objectAssign } from '../shared/utils'
import { assertWarning } from '../shared/utils/assert'
import type { PageContextBuiltInClient } from '../types'
import { releasePageContext } from './releasePageContext'
import { loadPageFiles } from './loadPageFiles'
import { getPageContextSerializedInHtml } from './getPageContextSerializedInHtml'

export { getPage }

const urlPathnameOriginal = getUrlPathname()

async function getPage<T = PageContextBuiltInClient>(): Promise<PageContextBuiltInClient & T> {
  let pageContext = getPageContextSerializedInHtml()
  objectAssign(pageContext, { isHydration: true })

  const pageFiles = await loadPageFiles(pageContext)
  objectAssign(pageContext, pageFiles)

  assertPristineUrl()

  const pageContextProxy = releasePageContext(pageContext)
  checkType<PageContextBuiltInClient>(pageContextProxy)
  return pageContextProxy as PageContextBuiltInClient & T
}

function assertPristineUrl() {
  const urlPathnameCurrent = getUrlPathname()
  assertWarning(
    urlPathnameOriginal === urlPathnameCurrent,
    `\`getPage()\` returned page information for URL \`${urlPathnameOriginal}\` instead of \`${urlPathnameCurrent}\`. If you want to be able to change the URL (e.g. with \`window.history.pushState\`) while using \`getPage()\`, then create a new GitHub issue.`
  )
}
