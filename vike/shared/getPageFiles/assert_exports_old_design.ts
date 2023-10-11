// TODO/v1-release: remove this

export { assertDefaultExports }
export { assertExportValues }
export { forbiddenDefaultExports }

import { assert, assertUsage } from '../utils.js'
import type { PageFile } from './getPageFileObject.js'

const enforceTrue = ['clientRouting']
function assertExportValues(pageFile: PageFile) {
  enforceTrue.forEach((exportName) => {
    assert(pageFile.fileExports)
    if (!(exportName in pageFile.fileExports)) return
    const explainer = `The value of \`${exportName}\` is only allowed to be \`true\`.`
    assertUsage(
      pageFile.fileExports[exportName] !== false,
      `${pageFile.filePath} has \`export { ${exportName} }\` with the value \`false\` which is prohibited: remove \`export { ${exportName} }\` instead. (${explainer})`
    )
    assertUsage(
      pageFile.fileExports[exportName] === true,
      `${pageFile.filePath} has \`export { ${exportName} }\` with a forbidden value. ${explainer}`
    )
  })
}

// Forbid exports such as `export default { render }`, because only `export { render }` can be statically analyzed by `es-module-lexer`.
const forbiddenDefaultExports = ['render', 'clientRouting', 'prerender', 'doNotPrerender']
function assertDefaultExports(defaultExportName: string, filePath: string) {
  assertUsage(
    !forbiddenDefaultExports.includes(defaultExportName),
    `${filePath} has \`export default { ${defaultExportName} }\` which is prohibited, use \`export { ${defaultExportName} }\` instead.`
  )
}
