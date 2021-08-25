import { checkType, getUrlPathname, hasProp, objectAssign } from '../shared/utils'
import { assert, assertWarning } from '../shared/utils/assert'
import type { PageContextBuiltInClient } from '../types'
import { preparePageContext } from './preparePageContext'
import { getPageContextSerializedInHtml } from './getPageContextSerializedInHtml'

export { getPage }

const urlPathnameOriginal = getUrlPathname()

async function getPage<T = PageContextBuiltInClient>(): Promise<PageContextBuiltInClient & T> {
  let pageContext = getPageContextSerializedInHtml()
  objectAssign(pageContext, { isHydration: true })
  assert(hasProp(pageContext, 'isHydration', 'boolean'))

  const pageContextProxy = await preparePageContext(pageContext)

  assertPristineUrl()

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
