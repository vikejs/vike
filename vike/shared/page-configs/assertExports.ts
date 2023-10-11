export { assertExportsOfValueFile }
export { assertExportsOfConfigFile }

import { assert, assertUsage, assertWarning, isObject } from '../utils.js'
import pc from '@brillout/picocolors'

const EXPORTS_IGNORE = [
  // vite-plugin-solid adds `export { $$registrations }`
  '$$registrations',
  // @vitejs/plugin-vue adds `export { _rerender_only }`
  '_rerender_only'
]

// Tolerate `export { frontmatter }` in .mdx files
const TOLERATE_SIDE_EXPORTS = ['.md', '.mdx']

function assertExportsOfValueFile(
  fileExports: Record<string, unknown>,
  filePathToShowToUser: string,
  configName: string
) {
  assertExports(fileExports, filePathToShowToUser, configName)
}

function assertExportsOfConfigFile(
  fileExports: Record<string, unknown>,
  filePathToShowToUser: string
): asserts fileExports is { default: Record<string, unknown> } {
  assertExports(fileExports, filePathToShowToUser)
  const exportDefault = fileExports.default
  assertUsage(
    isObject(exportDefault),
    `The ${pc.cyan('export default')} of ${filePathToShowToUser} should be an object (but it's ${pc.cyan(
      `typeof exportDefault === ${JSON.stringify(typeof exportDefault)}`
    )} instead)`
  )
}

function assertExports(
  fileExports: Record<string, unknown>,
  filePathToShowToUser: string,
  configName?: string
) {
  const exportsAll = Object.keys(fileExports)
  const exportsRelevant = exportsAll.filter((exportName) => !EXPORTS_IGNORE.includes(exportName))
  const exportsInvalid = exportsRelevant.filter((e) => e !== 'default')
  const exportsHasDefault = exportsRelevant.includes('default')
  if (exportsInvalid.length === 0) {
    if (exportsHasDefault) {
      return
    } else {
      assert(exportsRelevant.length === 0)
      assertUsage(
        false,
        `${filePathToShowToUser} doesn't export any value, but it should have a ${pc.cyan('export default')} instead`
      )
    }
  } else {
    // !configName => isConfigFile
    if (!configName) {
      const exportsInvalidStr = exportsInvalid.join(', ')
      assertWarning(
        exportsInvalid.length === 0,
        `${filePathToShowToUser} replace ${pc.cyan(`export { ${exportsInvalidStr} }`)} with ${pc.cyan(
          `export default { ${exportsInvalidStr} }`
        )}`,
        { onlyOnce: true }
      )
    }
    // configName => isValueFile
    else {
      if (TOLERATE_SIDE_EXPORTS.some((ext) => filePathToShowToUser.endsWith(ext))) return
      exportsInvalid.forEach((exportInvalid) => {
        assertWarning(
          exportsInvalid.length === 0,
          `${filePathToShowToUser} should only have a default export: move ${pc.cyan(
            `export { ${exportInvalid} }`
          )} to +config.h.js or its own +${exportsInvalid}.js`,
          { onlyOnce: true }
        )
      })
    }
  }
}
