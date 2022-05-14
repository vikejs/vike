export { getExportNames }

import { assert } from '../../utils'
import type { PageFile } from '../types'

function getExportNames(p: PageFile): string[] {
  if (p.exportNames) {
    return p.exportNames
  }
  assert(p.fileExports, p.pageId)
  const exportNames = Object.keys(p.fileExports)
  return exportNames
}
