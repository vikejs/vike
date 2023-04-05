export { assertDefaultExportUnknown }
export { assertDefaultExportObject }

import { assert, assertUsage } from './assert'
import { hasProp } from './hasProp'
import { checkType } from './checkType'
import { isObject } from './isObject'

type SingleDefaultExport = { default: unknown }
function assertDefaultExportUnknown(
  fileExports: Record<string, unknown>,
  filePath: string
): asserts fileExports is SingleDefaultExport {
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
    `${filePath} should export an object: its \`export default\` is a \`${typeof defaultExport}\` but it should be an object`
  )
}

function assertSingleDefaultExport(
  fileExports: Record<string, unknown>,
  filePath: string,
  defaultExportValueIsUnknown: boolean
): asserts fileExports is SingleDefaultExport {
  const exportsAll = Object.keys(fileExports)
  const exportsInvalid = exportsAll.filter((e) => e !== 'default')
  const exportsHasDefault = exportsAll.includes('default')
  if (exportsInvalid.length === 0) {
    if (exportsHasDefault) {
      return
    } else {
      assert(exportsAll.length === 0)
      assertUsage(false, `${filePath} doesn't export any value, but it should have a \`export default\` instead`)
    }
  } else {
    const exportsInvalidStr = exportsInvalid.join(', ')
    if (!defaultExportValueIsUnknown) {
      assertUsage(
        exportsInvalid.length === 0,
        `${filePath} replace \`export { ${exportsInvalidStr} }\` with \`export default { ${exportsInvalidStr} }\``
      )
    } else {
      assertUsage(
        exportsInvalid.length === 0,
        `${filePath} should only have a default export: remove \`export { ${exportsInvalidStr} }\``
      )
    }
  }
}
