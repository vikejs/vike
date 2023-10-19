export { getExportPath }

import { assert } from '../utils.js'

function getExportPath(fileExportPath: null | string[]): null | string {
  if (!fileExportPath) return null
  let prefix = ''
  let suffix = ''
  let [exportName, ...exportObjectPath] = fileExportPath
  if (!exportName) return null
  if (exportName === '*') {
    assert(exportObjectPath.length === 0)
    return 'export *'
  } else if (exportName === 'default') {
    prefix = 'export default'
  } else {
    prefix = 'export'
    exportObjectPath = [exportName, ...exportObjectPath]
  }
  exportObjectPath.forEach((prop) => {
    prefix = `${prefix} { ${prop}`
    suffix = ` }${suffix}`
  })
  const exportPath = prefix + suffix
  return exportPath
}
