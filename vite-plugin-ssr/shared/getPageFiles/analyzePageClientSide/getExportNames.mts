export { getExportNames }

import { assert } from '../../utils.mjs'
import type { PageFile } from '../getPageFileObject.mjs'

function getExportNames(p: PageFile): string[] {
  if (p.fileType === '.css') {
    return []
  }
  if (p.exportNames) {
    return p.exportNames
  }
  assert(p.fileExports, p.filePath)
  const exportNames = Object.keys(p.fileExports)
  return exportNames
}
