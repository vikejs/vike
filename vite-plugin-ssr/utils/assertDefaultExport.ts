export { assertDefaultExportUnknown }
export { assertDefaultExportObject }

import { assert, assertUsage, assertWarning } from './assert.js'
import { isObject } from './isObject.js'

const IGNORE = [
  // vite-plugin-solid adds `export { $$registrations }`
  '$$registrations',
  // @vitejs/plugin-vue adds `export { _rerender_only }`
  '_rerender_only'
]

// support `export { frontmatter }` in .mdx files
const FILES_WITH_SIDE_EXPORTS = ['.md', '.mdx']

function assertDefaultExportUnknown(
  fileExports: Record<string, unknown>,
  filePath: string
): asserts fileExports is Record<string, unknown> & { default: unknown } {
  assertSingleDefaultExport(fileExports, filePath, true)
}

function assertDefaultExportObject(
  fileExports: Record<string, unknown>,
  filePath: string
): asserts fileExports is { default: Record<string, unknown> } {
  assertSingleDefaultExport(fileExports, filePath, false)
  const defaultExport = fileExports.default
  assertUsage(
    isObject(defaultExport),
    `${filePath} should default export an object: its \`export default\` is a \`${typeof defaultExport}\` but it should be an object instead`
  )
}

function assertSingleDefaultExport(
  fileExports: Record<string, unknown>,
  filePath: string,
  defaultExportValueIsUnknown: boolean
) {
  const exportsAll = Object.keys(fileExports)
  const exportsRelevant = exportsAll.filter((exportName) => !IGNORE.includes(exportName))
  const exportsInvalid = exportsRelevant.filter((e) => e !== 'default')
  const exportsHasDefault = exportsRelevant.includes('default')
  if (exportsInvalid.length === 0) {
    if (exportsHasDefault) {
      return
    } else {
      assert(exportsRelevant.length === 0)
      assertUsage(false, `${filePath} doesn't export any value, but it should have a \`export default\` instead`)
    }
  } else if (!FILES_WITH_SIDE_EXPORTS.some((ext) => filePath.endsWith(ext))) {
    const exportsInvalidStr = exportsInvalid.join(', ')
    if (defaultExportValueIsUnknown) {
      assertWarning(
        exportsInvalid.length === 0,
        `${filePath} should only have a default export: remove \`export { ${exportsInvalidStr} }\``,
        { onlyOnce: true }
      )
    } else {
      assertWarning(
        exportsInvalid.length === 0,
        `${filePath} replace \`export { ${exportsInvalidStr} }\` with \`export default { ${exportsInvalidStr} }\``,
        { onlyOnce: true }
      )
    }
  }
}
