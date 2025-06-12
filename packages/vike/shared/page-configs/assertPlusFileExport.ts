export { assertPlusFileExport }

import { assert, assertUsage, assertWarning } from '../utils.js'
import pc from '@brillout/picocolors'

const SIDE_EXPORTS_TOLERATE = [
  // vite-plugin-solid adds `export { $$registrations }`
  '$$registrations',
  // @vitejs/plugin-vue adds `export { _rerender_only }`
  '_rerender_only',
]
// Tolerate `export { frontmatter }` in .mdx files
const SIDE_EXPORTS_DO_NOT_CHECK = ['.md', '.mdx'] as const

function assertPlusFileExport(fileExports: Record<string, unknown>, filePathToShowToUser: string, configName: string) {
  const exportNames = Object.keys(fileExports)
  const isValid = (exportName: string) => exportName === 'default' || exportName === configName

  // Error upon missing/ambiguous export
  const exportNamesValid = exportNames.filter(isValid)
  const exportDefault = pc.code('export default')
  const exportNamed = pc.code(`export { ${configName} }`)
  if (exportNamesValid.length === 0) {
    assertUsage(false, `${filePathToShowToUser} should define ${exportNamed} or ${exportDefault}`)
  }
  if (exportNamesValid.length === 2) {
    assertUsage(false, `${filePathToShowToUser} is ambiguous: remove ${exportDefault} or ${exportNamed}`)
  }
  assert(exportNamesValid.length === 1)

  // Warn upon side exports
  const exportNamesInvalid = exportNames
    .filter((e) => !isValid(e))
    .filter((exportName) => !SIDE_EXPORTS_TOLERATE.includes(exportName))
  if (!SIDE_EXPORTS_DO_NOT_CHECK.some((ext) => filePathToShowToUser.endsWith(ext))) {
    exportNamesInvalid.forEach((exportInvalid) => {
      assertWarning(
        false,
        `${filePathToShowToUser} unexpected ${pc.cyan(`export { ${exportInvalid} }`)}, see https://vike.dev/no-side-exports`,
        {
          onlyOnce: true,
        },
      )
    })
  }
}
