export { initDevEntry }

import { setPageFilesAsync } from '../../../shared/getPageFiles.js'
import { getPageFilesExports } from './getPageFilesExports.js'

function initDevEntry() {
  setPageFilesAsync(getPageFilesExports)
}
