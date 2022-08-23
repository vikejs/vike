import { assertPageContextProvidedByUser } from '../assertPageContextProvidedByUser'
import { assertUsage, hasProp, isObjectWithKeys, objectAssign, assertWarning } from './utils'
import { assertRouteParams } from './resolveRouteFunction'

export { callOnBeforeRouteHook }
export type { OnBeforeRouteHook }

type OnBeforeRouteHook = {
  filePath: string
  onBeforeRoute: (pageContext: { urlOriginal: string } & Record<string, unknown>) => unknown
}

async function callOnBeforeRouteHook(
  onBeforeRouteHook: OnBeforeRouteHook,
  pageContext: {
    urlOriginal: string
    _allPageIds: string[]
  }
): Promise<null | {
  urlOriginal?: string
  _urlPristine?: string
  _pageId?: string | null
  routeParams?: Record<string, string>
}> {
  const hookReturn: unknown = await onBeforeRouteHook.onBeforeRoute(pageContext)

  const errPrefix = `The \`onBeforeRoute()\` hook exported by ${onBeforeRouteHook.filePath}`

  assertUsage(
    hookReturn === null ||
      hookReturn === undefined ||
      (isObjectWithKeys(hookReturn, ['pageContext'] as const) && hasProp(hookReturn, 'pageContext')),
    `${errPrefix} should return \`null\`, \`undefined\`, or a plain JavaScript object \`{ pageContext: { /* ... */ } }\`.`
  )

  if (hookReturn === null || hookReturn === undefined) {
    return null
  }

  assertUsage(
    hasProp(hookReturn, 'pageContext', 'object'),
    `${errPrefix} returned \`{ pageContext }\` but \`pageContext\` should be a plain JavaScript object.`
  )

  if (hasProp(hookReturn.pageContext, '_pageId') && !hasProp(hookReturn.pageContext, '_pageId', 'null')) {
    const errPrefix2 = `${errPrefix} returned \`{ pageContext: { _pageId } }\` but \`_pageId\` should be`
    assertUsage(hasProp(hookReturn.pageContext, '_pageId', 'string'), `${errPrefix2} a string or \`null\``)
    assertUsage(
      pageContext._allPageIds.includes(hookReturn.pageContext._pageId),
      `${errPrefix2} one of following values: \`[${pageContext._allPageIds.map((s) => `'${s}'`).join(', ')}]\`.`
    )
  }
  if (hasProp(hookReturn.pageContext, 'routeParams')) {
    assertRouteParams(
      hookReturn.pageContext,
      `${errPrefix} returned \`{ pageContext: { routeParams } }\` but \`routeParams\` should`
    )
  }

  const pageContextAddendumHook = {}

  if (hasProp(hookReturn.pageContext, 'url')) {
    assertWarning(
      false,
      `${errPrefix} returned \`{ pageContext: { url } }\` but \`pageContext.url\` has been renamed to \`pageContext.urlOriginal\`. Return \`{ pageContext: { urlOriginal } }\` instead. (See https://vite-plugin-ssr.com/migration/0.4.23 for more information.)`,
      { onlyOnce: true }
    )
    hookReturn.pageContext.urlOriginal = hookReturn.pageContext.url
    delete hookReturn.pageContext.url
  }
  if (hasProp(hookReturn.pageContext, 'urlOriginal')) {
    assertUsage(
      hasProp(hookReturn.pageContext, 'urlOriginal', 'string'),
      `${errPrefix} returned \`{ pageContext: { urlOriginal } }\` but \`urlOriginal\` should be a string`
    )
    objectAssign(pageContextAddendumHook, { _urlPristine: pageContext.urlOriginal })
  }

  assertPageContextProvidedByUser(hookReturn.pageContext, {
    hook: { hookFilePath: onBeforeRouteHook.filePath, hookName: 'onBeforeRoute' }
  })

  objectAssign(pageContextAddendumHook, hookReturn.pageContext)

  return pageContextAddendumHook
}
