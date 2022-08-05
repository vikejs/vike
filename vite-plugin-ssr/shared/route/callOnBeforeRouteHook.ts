import { assertPageContextProvidedByUser } from '../assertPageContextProvidedByUser'
import { assertUsage, hasProp, isObjectWithKeys, objectAssign } from './utils'
import { assertRouteParams } from './resolveRouteFunction'

export { callOnBeforeRouteHook }
export type { OnBeforeRouteHook }

type OnBeforeRouteHook = {
  filePath: string
  onBeforeRoute: (pageContext: { url: string } & Record<string, unknown>) => unknown
}

async function callOnBeforeRouteHook(
  onBeforeRouteHook: OnBeforeRouteHook,
  pageContext: {
    url: string
    _allPageIds: string[]
  },
): Promise<null | {
  url?: string
  _pageId?: string | null
  routeParams?: Record<string, string>
}> {
  const hookReturn: unknown = await onBeforeRouteHook.onBeforeRoute(pageContext)

  const errPrefix = `The \`onBeforeRoute()\` hook exported by ${onBeforeRouteHook.filePath}`

  assertUsage(
    hookReturn === null ||
      hookReturn === undefined ||
      (isObjectWithKeys(hookReturn, ['pageContext'] as const) && hasProp(hookReturn, 'pageContext')),
    `${errPrefix} should return \`null\`, \`undefined\`, or a plain JavaScript object \`{ pageContext: { /* ... */ } }\`.`,
  )

  if (hookReturn === null || hookReturn === undefined) {
    return null
  }

  assertUsage(
    hasProp(hookReturn, 'pageContext', 'object'),
    `${errPrefix} returned \`{ pageContext }\` but \`pageContext\` should be a plain JavaScript object.`,
  )

  if (hasProp(hookReturn.pageContext, '_pageId') && !hasProp(hookReturn.pageContext, '_pageId', 'null')) {
    const errPrefix2 = `${errPrefix} returned \`{ pageContext: { _pageId } }\` but \`_pageId\` should be`
    assertUsage(hasProp(hookReturn.pageContext, '_pageId', 'string'), `${errPrefix2} a string or \`null\``)
    assertUsage(
      pageContext._allPageIds.includes(hookReturn.pageContext._pageId),
      `${errPrefix2} one of following values: \`[${pageContext._allPageIds.map((s) => `'${s}'`).join(', ')}]\`.`,
    )
  }
  if (hasProp(hookReturn.pageContext, 'routeParams')) {
    assertRouteParams(
      hookReturn.pageContext,
      `${errPrefix} returned \`{ pageContext: { routeParams } }\` but \`routeParams\` should`,
    )
  }

  if (hasProp(hookReturn.pageContext, 'url')) {
    assertUsage(
      hasProp(hookReturn.pageContext, 'url', 'string'),
      `${errPrefix} returned \`{ pageContext: { url } }\` but \`url\` should be a string`,
    )
  }

  assertPageContextProvidedByUser(hookReturn.pageContext, {
    hook: { hookFilePath: onBeforeRouteHook.filePath, hookName: 'onBeforeRoute' },
  })

  const pageContextAddendumHook = {}
  objectAssign(pageContextAddendumHook, hookReturn.pageContext)

  return pageContextAddendumHook
}
