export { assertPlusFileExport }

import { assert, assertUsage, assertWarning } from '../utils.js'
import pc from '@brillout/picocolors'

const EXPORTS_IGNORE = [
  // vite-plugin-solid adds `export { $$registrations }`
  '$$registrations',
  // @vitejs/plugin-vue adds `export { _rerender_only }`
  '_rerender_only'
]

// Tolerate `export { frontmatter }` in .mdx files
const TOLERATE_SIDE_EXPORTS = ['.md', '.mdx'] as const

function assertPlusFileExport(fileExports: Record<string, unknown>, filePathToShowToUser: string, configName: string) {
  const exportNames = Object.keys(fileExports).filter((exportName) => !EXPORTS_IGNORE.includes(exportName))
  const isValid = (exportName: string) => exportName === 'default' || exportName === configName
  const exportNamesValid = exportNames.filter(isValid)
  const exportNamesInvalid = exportNames.filter((e) => !isValid(e))

  if (exportNamesValid.length === 1 && exportNamesInvalid.length === 0) {
    return
  }

  const exportDefault = pc.code('export default')
  const exportNamed = pc.code(`export { ${configName} }`)
  assert(exportNamesValid.length <= 2)
  if (exportNamesValid.length === 0) {
    assertUsage(false, `${filePathToShowToUser} should have ${exportNamed} or ${exportDefault}`)
  }
  if (exportNamesValid.length === 2) {
    assertUsage(false, `${filePathToShowToUser} is ambiguous: remove ${exportDefault} or ${exportNamed}`)
  }
  if (!TOLERATE_SIDE_EXPORTS.some((ext) => filePathToShowToUser.endsWith(ext))) {
    exportNamesInvalid.forEach((exportInvalid) => {
      assertWarning(false, `${filePathToShowToUser} unexpected ${pc.cyan(`export { ${exportInvalid} }`)}`, {
        onlyOnce: true
      })
    })
  }
}
