export { determinePageIdOld }

import { slice, assert } from './utils.js'

// TO-DO/next-major-release: remove
function determinePageIdOld(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  assert(!pageId.includes('\\'))
  return pageId
}
