export { assertDefaultExports }
export { assertExportValues }
export { forbiddenDefaultExports }
export { assertNoReExports }

import { assert, assertUsage } from '../utils'
import type { PageFile } from './types'

const enforceTrue = ['clientRouting', 'doNotPrerender']
function assertExportValues(pageFile: PageFile) {
  enforceTrue.forEach((exportName) => {
    assert(pageFile.fileExports)
    if (!(exportName in pageFile.fileExports)) return
    const explainer = `The value of \`${exportName}\` is only allowed to be \`true\`.`
    assertUsage(
      pageFile.fileExports[exportName] !== false,
      `${pageFile.filePath} has \`export { ${exportName} }\` with the value \`false\` which is forbidden: remove \`export { ${exportName} }\` instead. (${explainer})`,
    )
    assertUsage(
      pageFile.fileExports[exportName] === true,
      `${pageFile.filePath} has \`export { ${exportName} }\` with a forbidden value. ${explainer}`,
    )
  })
}

// Forbid exports such as `export default { render }`, because only `export { render }` can be statically analyzed by `es-module-lexer`.
const forbiddenDefaultExports = ['render', 'clientRouting', 'prerender', 'doNotPrerender']
function assertDefaultExports(defaultExportName: string, filePath: string) {
  assertUsage(
    !forbiddenDefaultExports.includes(defaultExportName),
    `${filePath} has \`export default { ${defaultExportName} }\` which is forbidden, use \`export { ${defaultExportName} }\` instead.`,
  )
}

function assertNoReExports(pageFile: PageFile) {
  const { hasReExports, filePath } = pageFile
  assertUsage(
    // Vue SFCs can be transformed to include a wildcard re-export
    //  - https://github.com/brillout/vite-plugin-ssr/issues/381#issuecomment-1195633572
    hasReExports === false || filePath.endsWith('.vue'),
    `${filePath} has \`export * from 'some-module';\` which is forbidden for \`.page.\` files, use \`import { something } from 'some-module'; export { something };\` instead.`,
  )
}
