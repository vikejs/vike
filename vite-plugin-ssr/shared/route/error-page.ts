import { assert, assertUsage } from './utils'

export { getErrorPageId }
export { isErrorPageId }

function getErrorPageId(allPageIds: string[]): string | null {
  const errorPageIds = allPageIds.filter((pageId) => isErrorPageId(pageId))
  assertUsage(
    errorPageIds.length <= 1,
    `Only one \`_error.page.js\` is allowed. Found several: ${errorPageIds.join(' ')}`,
  )
  if (errorPageIds.length > 0) {
    const errorPageId = errorPageIds[0]
    assert(errorPageId)
    return errorPageId
  }
  return null
}

function isErrorPageId(pageId: string): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_error')
}
