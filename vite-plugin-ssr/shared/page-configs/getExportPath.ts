export { getExportPath }

import { assert } from '../utils.js'

function getExportPath(fileExportPath: string[]): string {
  let prefix = ''
  let suffix = ''
  let [exportName, ...exportObjectPath] = fileExportPath
  assert(exportName)
  if (exportName === 'default') {
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
