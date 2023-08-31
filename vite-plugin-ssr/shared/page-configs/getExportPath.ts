export { getExportPath }

import { assert } from '../utils.js'

// TODO: return null instead of 'export default'
//  - Also return null insead of 'export *'?
function getExportPath(fileExportPath: string[]): string {
  let prefix = ''
  let suffix = ''
  let [exportName, ...exportObjectPath] = fileExportPath
  assert(exportName)
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
