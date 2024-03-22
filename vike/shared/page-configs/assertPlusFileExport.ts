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
  const exportsAll = Object.keys(fileExports).filter((exportName) => !EXPORTS_IGNORE.includes(exportName))
  const exportsInvalid = exportsAll.filter((e) => e !== 'default' && e !== configName)
  if (exportsInvalid.length === 0) {
    if (exportsAll.length === 1) {
      return
    }
    const exportDefault = pc.cyan('export default')
    const exportNamed = pc.cyan(`export { ${configName} }`)
    if (exportsAll.length === 0) {
      assertUsage(
        false,
        `${filePathToShowToUser} doesn't export any value, but it should have a ${exportNamed} or ${exportDefault}`
      )
    } else {
      assert(exportsAll.length === 2) // because `exportsInvalid.length === 0`
      assertWarning(
        false,
        `The exports of ${filePathToShowToUser} are ambiguous: remove ${exportDefault} or ${exportNamed}`,
        { onlyOnce: true }
      )
    }
  } else {
    if (TOLERATE_SIDE_EXPORTS.some((ext) => filePathToShowToUser.endsWith(ext))) return
    exportsInvalid.forEach((exportInvalid) => {
      assertWarning(
        false,
        `${filePathToShowToUser} should have only one export: move ${pc.cyan(
          `export { ${exportInvalid} }`
        )} to its own +${exportsInvalid}.js file`,
        { onlyOnce: true }
      )
    })
  }
}
