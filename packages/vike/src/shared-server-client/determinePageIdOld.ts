export { determinePageIdOld }

import { assert } from '../utils/assert.js'
import { slice } from '../utils/slice.js'

// TO-DO/next-major-release: remove
function determinePageIdOld(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  assert(!pageId.includes('\\'))
  return pageId
}
