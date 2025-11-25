export { getExportPath }

import { assert } from '../utils.js'

function getExportPath(fileExportPathToShowToUser: null | string[], configName: string): null | string {
  if (!fileExportPathToShowToUser) return null
  let [exportName, ...exportObjectPath] = fileExportPathToShowToUser
  if (!exportName) return null
  if (exportObjectPath.length === 0 && ['*', 'default', configName].includes(exportName)) return null
  assert(exportName !== '*')

  let prefix = ''
  let suffix = ''
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
