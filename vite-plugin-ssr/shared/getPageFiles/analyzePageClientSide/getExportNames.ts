export { getExportNames }

import { assert } from '../../utils'
import type { PageFile } from '../types'

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
